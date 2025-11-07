import boto3
import json
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
from decimal import Decimal

# Load DynamoDB tables
dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('User')
prof_table = dynamodb.Table('UTD_Professor')

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def lambda_handler(event, context):
    try:
        # Extract parameters
        params = event.get('queryStringParameters')

        # Access user tags
        username = params.get('username') # Get the username from the event
        response = user_table.get_item(Key={'username': username})
        user = response.get('Item') # Get the item from the response in the form of a dictionary
        user_tags = user.get('tags')

        # Access professor tags
        response = prof_table.scan() # Get all prof entries
        profs = response.get('Items', [])
        prof_vectors = []
        for item in profs:
            prof_vectors.append(item.get('tag_embeddings')) # Make a list of lists of tags

        if user_tags == None:
            # Handle user tags not found error
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Invalid arguments; user not found'
                })
            }
        
        if prof_vectors == None:
            # Handle professor tags not found error
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'Professor tags not found'
                })
            }

        # Vectorize tags
        user_vector = np.mean(model.encode(user_tags, convert_to_numpy=True), axis=0)
        user_vector = [Decimal(str(x)) for x in user_vector.tolist()]
        user_vector /= np.linalg.norm(user_vector)

        # Convert to 2D
        user_vector = np.array([user_vector], dtype='float32')

        # Make index for professor embeddings
        index = faiss.read_index('/tmp/prof_index.faiss')
        index = faiss.IndexFlatIP(prof_vectors.shape[1])
        index.add(prof_vectors)

        n = index.ntotal # Find top n closest professor tags ()
        distances, indices = index.search(user_vector, n)

        # Store recommended professors, with a new attribute 'score' from [0,1] representing similarity to the user_tags
        recommended = []
        for idx, score in zip(indices[0], distances[0]):
            profs[idx]['score'] = score
            recommended.append(profs[idx])

        # Return successfully
        return {
            'statusCode': 200,
            'body': json.dumps(recommended)
        }


    except Exception as e:
        # Handle all exceptions
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error: ' + e
            })
        }