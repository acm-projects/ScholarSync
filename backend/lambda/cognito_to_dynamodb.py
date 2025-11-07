import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('User')

def lambda_handler(event, context):
    # event contains user data from Cognito
    user_attributes = event['request']['userAttributes']

    username = event['userName']  # Cognito-generated username (UUID if not set)
    email = user_attributes.get('email')
    full_name = user_attributes.get('name')  # Make sure you collect this in sign-up form
    interests = user_attributes.get('custom:interests')  # custom attributes in Cognito
    skills = user_attributes.get('custom:skills')        # custom attributes in Cognito

    # Write to DynamoDB
    table.put_item(
        Item={
            'username': username,
            'email': email,
            'full_name': full_name if full_name else "",
            'interests': interests if interests else "",
            'skills': skills if skills else ""
        }
    )

    return event  
