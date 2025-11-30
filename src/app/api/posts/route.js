import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.username || !data.title || !data.body) {
      return new Response(
        JSON.stringify({ error: "username, title, and body are required" }),
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    await dynamoDb.send(
      new PutCommand({
        TableName: "Post",
        Item: {
          username: data.username, 
          timestamp: timestamp,     
          title: data.title,
          body: data.body,
          tags: data.tags || [],
        },
      })
    );

    return new Response(
      JSON.stringify({ message: "Post created!", timestamp }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to create post" }),
      { status: 500 }
    );
  }
}