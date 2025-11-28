import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const workspaceID = searchParams.get("workspaceID");

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

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    return NextResponse.json(response.Items || []);
  }

export async function POST(request) {
    const body = await request.json();
    const { username, paperID, title, author, tags, pdfLink, date, action, workspaceID } = body;

    if (action === "remove") {
      const deleteParams = {
        TableName: "UserSavedPaper",
        Key: {
          username: username,
          paperID: paperID,
        },
      };

      const deleteCommand = new DeleteCommand(deleteParams);
      await docClient.send(deleteCommand);

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

      const putCommand = new PutCommand(putParams);
      await docClient.send(putCommand);

      return NextResponse.json({
        message: "Paper saved successfully",
        username,
        paperID,
        workspaceID: workspaceID || null,
      });
    }
}