import boto3
import json
from sklearn.metrics.pairwise import cosine_similarity  # pyright: ignore[reportMissingImports]
import numpy as np  # pyright: ignore[reportMissingImports]
from decimal import Decimal
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Optional

# Load DynamoDB tables
dynamodb = boto3.resource('dynamodb', region_name="us-east-2")
user_table = dynamodb.Table('User')
opportunity_table = dynamodb.Table('Post')

# Load model
bedrock_client = boto3.client("bedrock-runtime", region_name="us-east-2")
model_id = "amazon.titan-embed-text-v2:0"

# Turns Decimals into floats for JSON formatting, since DynamoDB returns numbers as Decimal
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

def lambda_handler(event, context):
    try:
        # Extract parameters
        params = event.get('queryStringParameters') or {}

        # Access user tags
        username = params.get('username') # Get the username from the event
        if not username:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing username parameter'
                })
            }
        
        response = user_table.get_item(Key={'username': username})
        user = response.get('Item') # Get the item from the response in the form of a dictionary
        if not user:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': f'User not found: {username}'
                })
            }
        
        user_tags = user.get('tags')

        # Access opportunity tags
        response = opportunity_table.scan() # Get all opportunity entries
        opportunities = response.get('Items', [])

        # Filter opportunities with embeddings and keep them aligned with vectors
        # Exclude opportunities posted by the requesting user
        opp_entries = [
            entry for entry in opportunities
            if entry.get('tag_embeddings') and entry.get('username') != username  # skip empty embeddings and user's own posts
        ]
        # Get list of opportunity tag vectors
        opp_vectors = [
            np.array([float(x) for x in entry.get('tag_embeddings', [])])
            for entry in opp_entries
        ]

        if user_tags == None:
            # Handle user tags not found error
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Invalid arguments; user not found'
                })
            }
        
        if opp_vectors == None:
            # Handle opportunity tags not found error
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'Opportunities tags not found'
                })
            }

        # Handle case where no opportunities with embeddings exist (after filtering)
        if len(opp_vectors) == 0:
            ranked_opportunities = []
        else:
            # Vectorize tags
            user_embeddings = [e for e in create_embeddings_batch(user_tags) if e is not None]

            user_vector = np.mean(np.array(user_embeddings), axis=0)
            user_vector /= np.linalg.norm(user_vector)

            # Make prof_vectors into a 2D array
            opp_vectors_array = np.vstack(opp_vectors)

            # Reshape user_vector to 2D (1, embedding_dim)
            user_vec_2d = user_vector.reshape(1, -1)

            # Compute cosine similarity
            similarities = cosine_similarity(user_vec_2d, opp_vectors_array)

            # Get indices sorted by descending similarity
            ranking_indices = np.argsort(similarities[0])[::-1]

            # Sorted similarities
            sorted_similarities = similarities[0][ranking_indices]

            # Build ranked list for opportunities that had embeddings
            # Return full opportunity object with similarity score added
            ranked_opportunities = []
            for idx, similarity in zip(ranking_indices, sorted_similarities):
                opp = opp_entries[idx]
                opp_copy = opp.copy()
                opp_copy['score'] = min(float(similarity) / 0.7, 1)
                ranked_opportunities.append(opp_copy)

        # Collect opportunities without embeddings
        # Return full opportunity object with score set to None
        # Exclude opportunities posted by the requesting user
        excluded_opportunities = []
        for entry in opportunities:
            if not entry.get('tag_embeddings') and entry.get('username') != username:
                opp_copy = entry.copy()
                opp_copy['score'] = None
                excluded_opportunities.append(opp_copy)

        # Return successfully
        return {
            'statusCode': 200,
            # Convert Decimal values to floats for JSON formatting
            'body': json.dumps(ranked_opportunities + excluded_opportunities, default=decimal_default)
        }

    except Exception as e:
        # Handle all exceptions
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': f'Internal server error: {str(e)}'
            })
        }
    
def create_embedding(text: str) -> Optional[List[float]]:
    # Create embedding for a single text string.
    try:
        response = bedrock_client.invoke_model(
            modelId=model_id,
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                'inputText': text
            })
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['embedding']
    
    except Exception as e:
        print(f"Error embedding text: {text[:50]}... - {e}")
        return None

def create_embeddings_batch(texts: List[str], max_workers: int = 10) -> List[Optional[List[float]]]:
    # Create embeddings for multiple texts concurrently.
    embeddings = [None] * len(texts)
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_index = {
            executor.submit(create_embedding, text): i 
            for i, text in enumerate(texts)
        }
        
        # Collect results as they complete
        completed = 0
        for future in as_completed(future_to_index):
            index = future_to_index[future]
            embeddings[index] = future.result()
            completed += 1
    
    return embeddings