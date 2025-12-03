import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({ region: "us-east-2" });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || image.size === 0) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const key = `uploads/${randomUUID()}-${image.name}`;

    await s3.send(new PutObjectCommand({
      Bucket: "post-image-scholarsync",
      Key: key,
      Body: buffer,
      ContentType: image.type,
    }));

    const imageUrl = `https://post-image-scholarsync.s3.amazonaws.com/${key}`;

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to upload image" }), { status: 500 });
  }
}

