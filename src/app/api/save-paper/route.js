// src/app/api/save-paper/route.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

console.log("🔍 Environment check:", {
  region: process.env.AWS_DEFAULT_REGION,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyStart: process.env.AWS_ACCESS_KEY_ID?.substring(0, 5),
});

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
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
    const workspaceID = searchParams.get("workspaceID"); // optional filter

    console.log("📥 GET request - Fetching papers for username:", username, "workspaceID:", workspaceID);

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const params = {
      TableName: "UserSavedPaper",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    };

    if (workspaceID) {
      params.FilterExpression = "workspaceID = :workspaceID";
      params.ExpressionAttributeValues[":workspaceID"] = workspaceID;
    }

    console.log("🔍 DynamoDB Query params:", params);

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    console.log("✅ Successfully fetched", response.Items?.length || 0, "papers");

    return NextResponse.json(response.Items || []);
  } catch (error) {
    console.error("❌ Error fetching saved papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved papers", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, paperID, title, author, tags, pdfLink, date, action, workspaceID } = body;

    console.log("📥 POST request received:", { username, paperID, action, workspaceID });

    if (!username || !paperID) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ error: "Username and paperID are required" }, { status: 400 });
    }

    if (action === "remove") {
      const deleteParams = {
        TableName: "UserSavedPaper",
        Key: {
          username: username,
          paperID: paperID,
        },
      };

      console.log("🗑️ Deleting paper from DynamoDB:", deleteParams);

      const deleteCommand = new DeleteCommand(deleteParams);
      await docClient.send(deleteCommand);

      console.log("✅ Paper removed successfully");

      return NextResponse.json({
        message: "Paper removed successfully",
        username,
        paperID,
      });
    } else {
      const putParams = {
        TableName: "UserSavedPaper",
        Item: {
          username: username,
          paperID: paperID,
          title: title,
          author: author,
          tags: tags || [],
          pdfLink: pdfLink,
          date: date,
          savedAt: new Date().toISOString(),
          status: "Want to Read",
          ...(workspaceID && { workspaceID }),
        },
      };

      console.log("💾 Saving paper to DynamoDB:", putParams);

      const putCommand = new PutCommand(putParams);
      await docClient.send(putCommand);

      console.log("✅ Paper saved successfully");

      return NextResponse.json({
        message: "Paper saved successfully",
        username,
        paperID,
        workspaceID: workspaceID || null,
      });
    }
  } catch (error) {
    console.error("❌ Error saving/removing paper:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to update paper", details: error.message },
      { status: 500 }
    );
  }
}