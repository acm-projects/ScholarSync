import os
import requests
import boto3
from dotenv import load_dotenv
from urllib.parse import urlparse
import time

load_dotenv()

API_KEY = os.getenv("S2_API_KEY")
S3_BUCKET = os.getenv("BUCKET_NAME")
TABLE_NAME = os.getenv("DYNAMO_TABLE_NAME")
REGION = os.getenv("AWS_DEFAULT_REGION")

if not all([API_KEY, S3_BUCKET, TABLE_NAME, REGION]):
    raise ValueError("Missing required environment variables in .env file")

s3 = boto3.client("s3", region_name=REGION)
table = boto3.resource("dynamodb", region_name=REGION).Table(TABLE_NAME)

BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
ARXIV_PDF_BASE = "https://arxiv.org/pdf/"
BATCH_SIZE = 50
DESIRED_PER_TOPIC = 10

def fetch_papers(topic, desired_count=DESIRED_PER_TOPIC):
    headers = {"x-api-key": API_KEY}
    valid_count, offset = 0, 0

    while valid_count < desired_count:
        params = {"query": topic, "limit": BATCH_SIZE, "offset": offset,
                  "fields": "title,authors,year,abstract,url,paperId,externalIds"}
        resp = requests.get(BASE_URL, headers=headers, params=params, timeout=15)
        papers = resp.json().get("data", [])
        if not papers:
            break

        for paper in papers:
            if valid_count >= desired_count:
                break

            # get arXiv id
            arxiv_id = (paper.get("externalIds") or {}).get("ArXiv") or ""
            url = paper.get("url") or ""
            if not arxiv_id and "arxiv.org" in url:
                arxiv_id = urlparse(url).path.strip("/").split("/")[-1]
            if not arxiv_id:
                continue

            pdf_url = f"{ARXIV_PDF_BASE}{arxiv_id}.pdf"
            s3_url = download_pdf_to_s3(pdf_url, paper.get("title", "N/A"))
            if not s3_url:
                continue

            table.put_item(Item={
                "paperID": paper.get("paperId") or pdf_url,
                "Title": paper.get("title", "N/A"),
                "Authors": ", ".join(a.get("name") for a in paper.get("authors", [])),
                "Abstract": paper.get("abstract", "N/A"),
                "Year": str(paper.get("year", "N/A")),
                "SourceURL": url,
                "PDFLink": s3_url
            })
            valid_count += 1

        offset += BATCH_SIZE
        time.sleep(1)

def download_pdf_to_s3(pdf_url, title):
    try:
        resp = requests.get(pdf_url, timeout=15)
        if resp.status_code != 200:
            return None
        key = f"papers/{''.join(c if c.isalnum() else '_' for c in title)[:100]}.pdf"
        s3.put_object(Bucket=S3_BUCKET, Key=key, Body=resp.content, ContentType="application/pdf")
        return f"https://{S3_BUCKET}.s3.{REGION}.amazonaws.com/{key}"
    except:
        return None

if __name__ == "__main__":
    for topic in ["machine learning", "computer science"]:
        fetch_papers(topic, desired_count=DESIRED_PER_TOPIC)
