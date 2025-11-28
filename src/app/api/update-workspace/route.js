import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = "UserWorkspaces";

export async function POST(req) {

    if (!username || !workspaceID || !workspaceName) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({
        username,
        workspaceID,
      }),
      UpdateExpression: "SET workspaceName = :workspaceName, updatedAt = :updatedAt",
      ExpressionAttributeValues: marshall({
        ":workspaceName": workspaceName,
        ":updatedAt": new Date().toISOString(),
      }),
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamo.send(command);

    return new Response(
      JSON.stringify({
        message: "Workspace created/updated successfully",
        workspace: response.Attributes,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
}