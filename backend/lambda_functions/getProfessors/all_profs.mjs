import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

/*
Lambda function to GET professor entries from UTD_Professor DynamoDB table
*/

export const handler = async (event) => {
    try {
        const command = new ScanCommand({ TableName: "UTD_Professor" }); // Get every item in UTD_Professor
        const response = await client.send(command); // Send command
        
        return {
            statusCode: 200,
            body: JSON.stringify(response.Items), // Return a list of each item JSON
        };
    }
    
    catch (err) {
        console.error(err); // Print error for debugging

        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }), // Return error message
        };
    }
};