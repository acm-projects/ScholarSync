import boto3
import json
import numpy as np  # pyright: ignore[reportMissingImports]
from decimal import Decimal
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Optional
from datetime import datetime, timezone

# Load DynamoDB tables
dynamodb = boto3.resource('dynamodb', region_name="us-east-2")
opportunity_table = dynamodb.Table('Post')

# Load model
bedrock_client = boto3.client("bedrock-runtime", region_name="us-east-2")
model_id = "amazon.titan-embed-text-v2:0"

def lambda_handler(event, context):
    try:
        # Parse request body (could be from API Gateway POST)
        body = event.get('body')
        if isinstance(body, str):
            body = json.loads(body)
        
        # Generate timestamp early - required as sort key in DynamoDB
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # Extract parameters
        username = body.get('username')
        title = body.get('title')
        body_text = body.get('body')
        tags = body.get('tags')
        imageUrl = body.get('imageUrl')  # Optional: S3 URL for uploaded image
        email = body.get('email')  # Optional: contact email
        phone = body.get('phone')  # Optional: contact phone

        # Validate required parameters
        if not username:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing username parameter'
                })
            }
        
        if not title:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing title parameter'
                })
            }
        
        if not body_text:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing body parameter'
                })
            }
        
        if not tags:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing tags parameter'
                })
            }
        
        # Ensure tags is a list
        if not isinstance(tags, list):
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Tags must be a list'
                })
            }

        # Create tag embeddings from tags
        tag_embeddings = vectorize_tags(tags)
        
        # Ensure timestamp is present (required as sort key)
        if not timestamp:
            timestamp = datetime.now(timezone.utc).isoformat()

        # Prepare item for DynamoDB
        item = {
            'username': username, # Partition key
            'timestamp': timestamp, # Sort key
            'title': title,
            'body': body_text,
            'tags': tags,
            'tag_embeddings': tag_embeddings
        }
        
        # Add optional fields if provided
        if imageUrl:
            item['imageUrl'] = imageUrl
        if email:
            item['email'] = email
        if phone:
            item['phone'] = phone

        # Put item in DynamoDB
        opportunity_table.put_item(Item=item)

        # Return successfully
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Opportunity created successfully',
                'username': username,
                'timestamp': timestamp
            })
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

def vectorize_tags(tags: List[str]) -> List[Decimal]:
    """
    Create embeddings from tags and return as a normalized vector.
    Returns a list of Decimal values suitable for DynamoDB storage.
    """
    # Return an empty list if tags is empty
    if not tags:
        return []
    
    # Create embeddings for all tags
    embeddings = create_embeddings_batch(tags, max_workers=10)
    successful = [e for e in embeddings if e is not None]
    
    if not successful:
        return []
    
    # Average all tag embeddings into a single vector
    vec = np.mean(np.array(successful), axis=0)

    # Normalize vector
    vec /= np.linalg.norm(vec)

    # Convert to Decimal format for DynamoDB
    vec_list = [Decimal(str(x)) for x in vec.tolist()]

    return vec_list