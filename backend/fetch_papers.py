import os
import requests
import boto3
from dotenv import load_dotenv
import time
import json
from botocore.exceptions import ClientError

# Load environment
load_dotenv()
API_KEY = os.getenv("S2_API_KEY")
S3_BUCKET = os.getenv("BUCKET_NAME")
TABLE_NAME = os.getenv("DYNAMO_TABLE_NAME", "ScholarPapers")
REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-2")

if not all([API_KEY, S3_BUCKET, TABLE_NAME, REGION]):
    raise ValueError("Missing required environment variables")

# AWS clients
s3 = boto3.client("s3", region_name=REGION)
table = boto3.resource("dynamodb", region_name=REGION).Table(TABLE_NAME)
bedrock = boto3.client("bedrock-runtime", region_name=REGION)

# Constants
BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
MODEL_ID = "us.anthropic.claude-3-5-sonnet-20240620-v1:0"

def fetch_papers(topic, desired_count=7):
    headers = {"x-api-key": API_KEY}
    valid_count, offset = 0, 0

    while valid_count < desired_count and offset < 500:
        params = {
            "query": topic,
            "limit": 50,
            "offset": offset,
            "fields": "title,authors,year,abstract,url,paperId,externalIds,openAccessPdf"
        }

        try:
            resp = requests.get(BASE_URL, headers=headers, params=params, timeout=15)
            papers = resp.json().get("data", [])
        except:
            break

        if not papers:
            break

        for paper in papers:
            if valid_count >= desired_count:
                break

            # Skip if no abstract
            if not paper.get("abstract"):
                continue

            pdf_url = find_pdf_url(paper)
            if not pdf_url:
                continue

            # Create consistent paperID
            paper_id = paper.get("paperId") or f"no-id-{int(time.time())}"

            # Upload PDF to S3 using paperID as key
            s3_url = download_pdf_to_s3(pdf_url, paper.get("title", "N/A"), paper_id)
            if not s3_url:
                continue

            try:
                authors = paper.get("authors", [])
                author_names = ", ".join([a.get("name", "Unknown") for a in authors]) if authors else "Unknown"
    
                table.put_item(Item={
                    "paperID": paper_id,
                    "Title": paper.get("title", "N/A"),
                    "Authors": author_names,
                    "Abstract": paper.get("abstract", ""),
                    "Year": str(paper.get("year", "N/A")),
                    "SourceURL": paper.get("url", ""),
                    "PDFLink": s3_url,  # Already includes paperID in path
                    "Tags": generate_tags(paper.get("title", ""), paper.get("abstract", "")) or []
            })
                valid_count += 1
            except ClientError:
                continue

        offset += 50
        time.sleep(1)


def find_pdf_url(paper):
    open_access_pdf = paper.get("openAccessPdf")
    if open_access_pdf and open_access_pdf.get("url"):
        return open_access_pdf.get("url")

    arxiv_id = (paper.get("externalIds") or {}).get("ArXiv") or ""
    if arxiv_id:
        return f"https://arxiv.org/pdf/{arxiv_id}.pdf"

    doi_id = (paper.get("externalIds") or {}).get("DOI") or ""
    if doi_id:
        return f"https://doi.org/{doi_id}"

    return None

def download_pdf_to_s3(pdf_url, title, paper_id):
    try:
        resp = requests.get(pdf_url, timeout=20, allow_redirects=True)
        
        if resp.status_code != 200 or (b'%PDF' not in resp.content[:4] and "application/pdf" not in resp.headers.get("Content-Type", "")):
            return None

        key = f"papers/{paper_id}.pdf"  # use consistent paperID
        s3.put_object(Bucket=S3_BUCKET, Key=key, Body=resp.content, ContentType="application/pdf")

        return f"https://{S3_BUCKET}.s3.{REGION}.amazonaws.com/{key}"
    except Exception:
        return None


def generate_tags(title, abstract):
    try:
        prompt = f"Generate 3-5 tech tags for: {title}. Abstract: {abstract}. Respond with JSON only: ['tag1','tag2']"
        
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 100,
            "messages": [{"role": "user", "content": prompt}]
        })
        
        response = bedrock.invoke_model(modelId=MODEL_ID, body=body)
        response_body = json.loads(response['body'].read())
        text_output = response_body['content'][0]['text'].strip()
        
        if text_output.startswith('['):
            tags = json.loads(text_output)
            return tags
        else:
            return ["ai", "technology", "research"]
            
    except Exception:
        return ["machine learning", "data science", "ai"]

if __name__ == "__main__":
    topics = ["machine learning", "deep learning", "computer science", "data science"]
    
    for topic in topics:
        fetch_papers(topic, desired_count=7)
