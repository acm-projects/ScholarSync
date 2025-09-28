import boto3
import requests
from bs4 import BeautifulSoup
import lxml

BASE_URL = 'https://profiles.utdallas.edu/browse'

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Scraper_State')

def lambda_handler(event, context):
    response = requests.get(BASE_URL) # Make a GET request to the url using the page number, receiving the HTML
    soup = BeautifulSoup(response.text, "lxml") # Create soup by parsing HTML using the lxml parser (faster than built-in "html.parser")

    pages = soup.find_all('a', class_="page-link") # Find all pagination links
    max_page = -1 # Default max_page to -1
    try:
        max_page = int(pages[-2].text.strip()) # pages[-1] is a "next" arrow, so pick out page[-2] instead
    except:
        pass
    
    # Get the previous utd_professor_scraper entry
    response = table.get_item(
        Key={
            "scraper_name": "utd_professor_scraper"
        }
    )
    item = response.get("Item", {})

    prev_max_page = item.get("max_page", -1)
    # Update max_page if it is different from prev_max_page and is not -1
    if max_page != prev_max_page and max_page != -1:
        table.update_item(
            Key={"scraper_name": "utd_prof_scraper"},
            UpdateExpression="SET max_page = :val",
            ExpressionAttributeValues={":val": max_page}
        )

    # Increment next_page by 1 until it is equal to the max page, in which case update it to 1
    next_page = item.get("next_page", 1)
    next_page = next_page + 1 if next_page < max_page else 1

    table.update_item(
        Key={"scraper_name": "utd_prof_scraper"},
        UpdateExpression="SET next_page = :np",
        ExpressionAttributeValues={":np": next_page}
    )