// src/app/api/get-workspace/route.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const params = {
      TableName: "UserWorkspaces",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    };

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    return NextResponse.json({
      workspaces: response.Items || [],
    });
  } catch (error) {
    console.error("❌ Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces", details: error.message },
      { status: 500 }
    );
  }
}