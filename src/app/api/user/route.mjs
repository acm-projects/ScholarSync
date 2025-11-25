import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

// POST https://localhost:3000/api/user
// Request body:
// { username, firstname, lastname, major, minor, year, skills, interests, resumeFile, allTags }
export async function POST(request) {
    try {
        // Get key-values from request
        const { username, firstname, lastname, major, minor, year, skills, interests, resumeFile, allTags } = await request.json();
        
        // Check if there is a username
        if (!username) {
            return new Response("username is required", { status: 400 });
        }

        // Specify columns being updated
        const updateFields = {
            firstname,
            lastname,
            major,
            minor,
            year,
            skills,
            interests,
            resumeFile,
            allTags
        };

        // Filter the fields for any null values
        const entries = Object.entries(updateFields);
        const validFields = [];
        for (const [key, value] of entries) {
            if (value !== undefined) {
                validFields.push([key, value]);
            }
        }

        // Create expressionParts, attributeNames, and attributeValues for the Update Command
        const expressionParts = [];
        const attributeNames = {};
        const attributeValues = {};

        for (const [key, value] of validFields) {
            const nameKey = `#${key}`;
            const valueKey = `:${key}`;
            expressionParts.push(`${nameKey} = ${valueKey}`);
            attributeNames[nameKey] = key;
            attributeValues[valueKey] = value;
        }

        // Specify what is being updated with UpdateExpression
        const UpdateExpression = "set " + expressionParts.join(", ");

        // Write command
        const command = new UpdateCommand({
            TableName: "User",
            Key: { username },
            UpdateExpression,
            ExpressionAttributeNames: attributeNames,
            ExpressionAttributeValues: attributeValues,
            ReturnValues: "ALL_NEW", // Return the entire item after the update
        });

        // Send command
        const response = await docClient.send(command);
        
        // Return successful response code, as well as the entire item after the update
        return new Response(JSON.stringify(response.Attributes), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    catch (err) {
        console.error(err); // Print error for debugging

        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};