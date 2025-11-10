import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('User')

def lambda_handler(event, context):
    user_attributes = event['request']['userAttributes']

    username = event['userName']
    email = user_attributes.get('email')
    full_name = user_attributes.get('name')

    table.put_item(
        Item={
            'username': username,
            'email': email,
            'full_name': full_name if full_name else "",
        }
    )

    return event