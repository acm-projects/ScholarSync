import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION });

export async function POST(req) {
  try {
    const body = await req.json();
    const { userID, paperID } = body;

    if (!userID || !paperID) {
      return new Response(JSON.stringify({ error: "Missing userID or paperID" }), { status: 400 });
    }

    const command = new PutItemCommand({
      TableName: "UserSavedPapers",
      Item: {
        userID: { S: userID },
        paperID: { S: paperID },
        savedAt: { S: new Date().toISOString() },
      },
    });

    await dynamo.send(command);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error saving paper:", err);
    return new Response(JSON.stringify({ error: "Failed to save paper" }), { status: 500 });
  }
}