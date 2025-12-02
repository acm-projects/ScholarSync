import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({ region: "us-east-2" });
const dynamoDb = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: "us-east-2" });

export async function POST(req) {
  try {
    const formData = await req.formData();

    const username = formData.get("username");
    const title = formData.get("title");
    const body = formData.get("body");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const skills = JSON.parse(formData.get("skills") || "[]");
    const image = formData.get("image");

    if (!username || !title || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    let imageUrl = null;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const key = `uploads/${randomUUID()}-${image.name}`;

      await s3.send(new PutObjectCommand({
        Bucket: "post-image-scholarsync",
        Key: key,
        Body: buffer,
        ContentType: image.type,
      }));

      imageUrl = `https://post-image-scholarsync.s3.amazonaws.com/${key}`;
    }

    const timestamp = new Date().toISOString();

    await dynamoDb.send(new PutCommand({
      TableName: "Post",
      Item: {
        username,
        timestamp,
        title,
        body,
        tags: skills,
        email,
        phone,
        imageUrl,
      },
    }));

    return new Response(JSON.stringify({ message: "Post created!" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create post" }), { status: 500 });
  }
}