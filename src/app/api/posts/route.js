import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.username || !data.title || !data.body) {
      return new Response(JSON.stringify({ error: "username, title, and body are required" }), {
        status: 400,
      });
    }

    await dynamoDb.send(
      new PutCommand({
        TableName: "Post",
        Item: {
          ...data,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return new Response(JSON.stringify({ message: "Post created!" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create post" }), { status: 500 });
  }
}