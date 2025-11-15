// src/app/api/update-status/route.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, paperID, status } = body;

    if (!username || !paperID || !status) {
      return NextResponse.json(
        { error: 'Username, paperID, and status are required' },
        { status: 400 }
      );
    }

    const params = {
      TableName: "UserSavedPaper",
      Key: {
        username: username,
        paperID: paperID,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
      ReturnValues: "ALL_NEW",
    };

    const command = new UpdateCommand(params);
    const response = await docClient.send(command);

    return NextResponse.json({ 
      message: 'Status updated successfully',
      item: response.Attributes 
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status", details: error.message },
      { status: 500 }
    );
  }
}