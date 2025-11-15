import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import pdf from "pdf-parse";

export const runtime = "nodejs";

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-2" });
const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-2" });

const TABLE_NAME = process.env.DYNAMO_TABLE_NAME || "ScholarPapers";
const MODEL_ID = "us.anthropic.claude-3-5-sonnet-20240620-v1:0";

async function extractTextFromPdf(pdfUrl) {
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error("Failed to fetch PDF from S3 URL");
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);
  return data.text;
}

async function getSummaryFromTable(paperID) {
  const command = new GetItemCommand({
    TableName: TABLE_NAME,
    Key: { paperID: { S: paperID } },
    ProjectionExpression: "Summary",
  });
  const result = await dynamo.send(command);
  return result.Item?.Summary?.S || null;
}

async function storeSummaryInTable(paperID, summary) {
  const command = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: { paperID: { S: paperID } },
    UpdateExpression: "SET Summary = :s, updatedAt = :u",
    ExpressionAttributeValues: {
      ":s": { S: summary },
      ":u": { S: new Date().toISOString() },
    },
  });
  await dynamo.send(command);
}

export async function POST(req) {
  try {
    const { pdfLink, paperID } = await req.json();

    if (!pdfLink || !paperID) {
      return new Response(JSON.stringify({ error: "pdfLink and paperID are required" }), {
        status: 400,
      });
    }

    console.log("Processing paperID:", paperID);

    const existingSummary = await getSummaryFromTable(paperID);
    if (existingSummary && existingSummary.trim().length > 0) {
      console.log("✅ Returning existing summary from DynamoDB");
      return new Response(JSON.stringify({ summary: existingSummary }), { status: 200 });
    }

    const extractedText = await extractTextFromPdf(pdfLink);
    if (!extractedText || extractedText.length < 100) {
      throw new Error("PDF has no readable text or is image-only");
    }

    const maxLength = 15000;
    const truncatedText =
      extractedText.length > maxLength ? extractedText.slice(0, maxLength) : extractedText;

    const prompt = `
Summarize the following academic paper in 5-6 sentences as a cohesive paragraph. 
Be detailed and specific, focusing on:
- The main contribution
- The methodology
- The key findings and conclusions
Avoid generic phrases like "Here is a summary" or "This paper discusses."

Paper content:
${truncatedText}
`;

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }],
    });

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      body,
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await bedrock.send(command);
    const decoded = new TextDecoder().decode(response.body);

    let parsed;
    try {
      parsed = JSON.parse(decoded);
    } catch {
      parsed = { content: [{ text: decoded }] };
    }

    const summary =
      parsed?.content?.[0]?.text?.trim() ||
      parsed?.output?.[0]?.content?.[0]?.text?.trim() ||
      "No summary generated.";

    // Store summary
    await storeSummaryInTable(paperID, summary);
    console.log("Summary stored in DynamoDB");

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (err) {
    console.error("Error generating summary:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
