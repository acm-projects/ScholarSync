import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

console.log("API /api/papers route loaded");

const s3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
const dynamo = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION });

export async function GET() {
  try {
    // List all PDF files from the S3 bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: "scholarsync-papers",
      Prefix: "papers/",
    });

    const s3Data = await s3.send(listCommand);

    if (!s3Data.Contents) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract paperIDs from S3 keys
    const paperIDs = s3Data.Contents.map((obj) => {
      const key = obj.Key;
      const match = key.match(/papers\/(.*?)\.pdf$/);
      return match ? match[1] : null;
    }).filter(Boolean);

    // Fetch metadata from DynamoDB for each paperID
    const papers = await Promise.all(
      paperIDs.map(async (paperID) => {
        try {
          const command = new GetItemCommand({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Key: { paperID: { S: paperID } },
          });

          const result = await dynamo.send(command);
          const item = result.Item || {};

          return {
            id: paperID,
            title: item.Title?.S || "Untitled Paper",
            author: item.Authors?.S || "Unknown Author",
            date: item.Year?.S || "N/A",
            tags: item.Tags?.L?.map((t) => t.S) || [],
            pdfLink: `https://scholarsync-papers.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/papers/${paperID}.pdf`,
            abstract: item.Abstract?.S || "No abstract available.",
            sourceURL: item.SourceURL?.S || "",
            content: item.Abstract?.S || "",
          };
        } catch (err) {
          console.error(`Error fetching ${paperID} from DynamoDB:`, err);
          return null;
        }
      })
    );

    // Filter out any null entries (if an ID didn’t exist in Dynamo)
    const validPapers = papers.filter(Boolean);

    return new Response(JSON.stringify(validPapers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching papers:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch papers from S3/DynamoDB" }),
      { status: 500 }
    );
  }
}
