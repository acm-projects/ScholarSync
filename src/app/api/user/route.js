import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

// POST https://localhost:3000/api/user
// Request body:
// { username, firstname, lastname, major, minor, year, skills, interests, resumeFile, allTags, tags }
export async function POST(request) {
    try {
        // Get key-values from request
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const { username, firstname, lastname, major, minor, year, skills, interests, resumeFile, allTags, tags } = body;
        
        // Check if there is a username
        if (!username) {
            return new Response(JSON.stringify({ error: "username is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        console.log("Received tags:", tags);
        console.log("Tags type:", typeof tags, Array.isArray(tags));

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
            allTags,
            tags  // This is what the lambda functions expect
        };

        // ALWAYS include tags - even if empty array, this is critical for lambda functions
        // Default to empty array if not provided
        updateFields.tags = Array.isArray(tags) ? tags : [];

        // Filter the fields for any null values (but keep empty arrays for tags)
        const entries = Object.entries(updateFields);
        const validFields = [];
        for (const [key, value] of entries) {
            // Always include tags even if empty array
            if (key === 'tags' && Array.isArray(value)) {
                validFields.push([key, value]);
            } else if (value !== undefined && value !== null && value !== '') {
                validFields.push([key, value]);
            }
        }
        
        console.log("Valid fields to update:", validFields.map(([k]) => k));
        console.log("Tags being saved:", updateFields.tags);

        // Check if there are any valid fields to update
        if (validFields.length === 0) {
            return new Response(JSON.stringify({ error: "No valid fields to update" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
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
        
        console.log("Update successful. Response attributes:", response.Attributes);
        console.log("Tags in response:", response.Attributes?.tags);
        
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
}

