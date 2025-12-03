import boto3
import json
import re
import requests
import hashlib
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import numpy as np
from decimal import Decimal
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Optional

# UTD Professor information
BASE_URL = 'https://profiles.utdallas.edu/browse'

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
professor_table = dynamodb.Table('UTD_Professor')

# Initialize S3
s3_client = boto3.client('s3', region_name='us-east-2')
S3_BUCKET = 'prof-pic-scholarsync'
S3_FOLDER = 'profile-pictures/'

# Load embeddings model
bedrock_client = boto3.client("bedrock-runtime", region_name="us-east-2")
model_id = "amazon.titan-embed-text-v2:0"

def scrape_utd_profs(page):
    response = requests.get(f"{BASE_URL}?page={str(page)}") # Make a GET request to the url using the page number, receiving the HTML
    soup = BeautifulSoup(response.text, "html.parser") # Create soup by parsing HTML using the lxml parser (faster than built-in "html.parser")

    for prof_div in soup.select('.profile-card'):
        profile_tag = prof_div.find('a')

        if profile_tag:
                
            email = None
            full_name = None
            titles = None
            summary = None
            phone_number = None
            office_room = None
            research_interests = None
            education = None
            publications = None
            tags = None
            tag_embeddings = None

            profile_url = profile_tag['href']
            if not profile_url.startswith('http'):
                profile_url = f'https://profiles.utdallas.edu{profile_url}'

            profile_response = requests.get(profile_url)
            profile_soup = BeautifulSoup(profile_response.text, 'html.parser')

            contact_info_tag = profile_soup.select_one('.contact_info')

            if contact_info_tag:
                # Get professor's name
                full_name = scrape_name(contact_info_tag)
                
                # Get professor's titles
                titles = scrape_titles(contact_info_tag)
                
                # Get professor's profile summary
                summary = scrape_summary(contact_info_tag)

                # Get professor's email
                driver = webdriver.Chrome()
                driver.get(profile_url)

                email = scrape_email(driver)

                # Get and upload profile photo (use driver for dynamic content)
                # Must be done before driver.quit()
                photo_url = scrape_and_upload_photo(driver, email, profile_soup)

                # Get Professional Preparation and Publications
                links_tag = profile_soup.select_one('#links')

                if links_tag:
                    links = links_tag.find_all('a')

                    for link in links:
                        target_id = link['href'].lstrip('#')

                        if target_id == 'preparation':
                            education = scrape_education(profile_soup)

                        elif target_id == 'publications':
                            publications = scrape_publications(driver)
                        
                        elif target_id == "areas":
                            research_interests = scrape_interests(profile_soup)

                driver.quit()

                # Get professor's phone number AND office
                # 1. Simple number: 972-883-3991
                phone_simple = re.compile(r"\d{3}-\d{3}-\d{4}")

                # 2. With country code and spaces: +1 972-883-3991
                phone_country_space = re.compile(r"\+\d{1,3}\s\d{3}-\d{3}-\d{4}")

                # 3. With country code and parentheses: +1 (972) 883-3991
                phone_country_parens = re.compile(r"\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}")

                # 4. Country code with parentheses, no space: +1(972) 883-3906
                phone_country_parens_nospace = re.compile(r"\+\d{1,3}\(\d{3}\)\s\d{3}-\d{4}")

                # Pattern: XX ##.### (where XX is between 1 and 4 capital letters, ## is between 1 and 2 digits, and ### is between 1 and 4 digits)
                office_pattern = re.compile(r"[A-Z]{1,4}\s\d{1,2}\.\d{1,4}")

                for line in contact_info_tag.stripped_strings: # Check each line in .contact-info
                    phone_pattern = phone_simple.search(line) or \
                                    phone_country_space.search(line) or \
                                    phone_country_parens.search(line) or \
                                    phone_country_parens_nospace.search(line)

                    if phone_pattern: # If line follows phone pattern:
                        phone_number = line.strip()

                    if office_pattern.search(line): # If line follows office pattern:
                        office_room = line.strip()
                
                # Get tags to search by
                tags = scrape_tags(contact_info_tag)
        
            item = {
                "email": email,
                "full_name": full_name,
                "titles": titles,
                "summary": summary,
                "phone_number": phone_number,
                "office_room": office_room,
                "research_interests": research_interests,
                "education": education,
                "publications": publications,
                "tags": tags,
                "tag_embeddings": vectorize_tags(tags),
                "profile_url": profile_url
            }
            
            # Add photo URL if available
            if photo_url:
                item["photo"] = photo_url

            # Skip empty strings, None, and empty lists
            item = {
                k: v for k, v in item.items()
                if v is not None and v != '' and not (isinstance(v, (list, np.ndarray)) and len(v) == 0)
            }

            # If professor_id is missing, skip this record
            if 'email' not in item:
                continue

            # Only add professor if "professor" (case-insensitive) appears in any title
            if 'titles' in item and isinstance(item['titles'], list):
                has_professor_title = any(
                    'professor' in title.lower() or 'prof.' in title.lower() or 'research' in title.lower()
                    for title in item['titles'] 
                    if isinstance(title, str)
                )
                if not has_professor_title:
                    continue

            # Add professor to UTD_Professors table
            professor_table.put_item(Item=item)

def scrape_name(contact_info_tag):
    # Find professor's name in website
    h1_name_tag = contact_info_tag.find('h1')
    
    # Parse professor's name from website
    full_name = ''
    if h1_name_tag:
        full_name = h1_name_tag.text.strip()
    
    return full_name

def scrape_titles(contact_info_tag):
    # Find titles in website
    div_titles = contact_info_tag.find('div', class_='profile-titles')

    # Parse titles from website
    titles = []
    if div_titles:
        div_title_tags = div_titles.find_all('div', class_='profile-title')

        for div in div_title_tags:
            titles.append(div.text.strip())
        
    return titles

def scrape_summary(contact_info_tag):
    # Find summary in website
    p_summary_tag = contact_info_tag.find('p', class_='profile_summary')
    
    # Parse email from website
    summary = ''
    if p_summary_tag:
        summary = p_summary_tag.text.strip()

    return summary

def scrape_email(driver):
    time.sleep(0.5) # wait 0.5 seconds for the email to load

    # Find email in website
    try:
        email_tag = driver.find_element(By.CSS_SELECTOR, 'a[data-evaluate="profile-eml"]')
    
    except:
        return ''

    # Parse email from website
    email = ''
    if email_tag:
        email = email_tag.text.strip()
    
    return email

def scrape_tags(contact_info_tag):
    # Find tags in website
    research_tags_tag = contact_info_tag.find("span", class_="tags")
    
    # Parse tags from website
    tags = []
    if research_tags_tag:
        linked_tags = research_tags_tag.find_all("a")

        for link in linked_tags:
            tags.append(link.text.strip())

    return tags

def scrape_and_upload_photo(driver, email, profile_soup):
    """
    Extract profile photo from <img> with class="profile_photo" and upload to S3.
    Returns the S3 URL if successful, None otherwise.
    """
    try:
        # Try to find the image using Selenium first (for dynamic content)
        img_url = None
        try:
            time.sleep(0.5)  # Wait for page to load
            photo_img_element = driver.find_element(By.CSS_SELECTOR, 'img.profile_photo')
            img_url = photo_img_element.get_attribute('src')
        except Exception as e:
            print(f"Could not find image via Selenium: {e}")
            # Fallback to BeautifulSoup
            photo_img = profile_soup.find('img', class_='profile_photo')
            if photo_img and photo_img.get('src'):
                img_url = photo_img['src']
                print(f"Found image via BeautifulSoup: {img_url}")
        
        if not img_url:
            return None
        
        # Handle relative URLs
        if not img_url.startswith('http'):
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
            elif img_url.startswith('/'):
                img_url = 'https://profiles.utdallas.edu' + img_url
            else:
                img_url = 'https://profiles.utdallas.edu/' + img_url
        
        # Download the image
        img_response = requests.get(img_url, timeout=10)
        if img_response.status_code != 200:
            print(f"Failed to download image. Status code: {img_response.status_code}")
            return None
        
        # Determine file extension from content type or URL
        content_type = img_response.headers.get('content-type', '')
        if 'jpeg' in content_type or 'jpg' in content_type:
            ext = '.jpg'
        elif 'png' in content_type:
            ext = '.png'
        elif 'gif' in content_type:
            ext = '.gif'
        elif 'webp' in content_type:
            ext = '.webp'
        else:
            # Try to get extension from URL
            if '.' in img_url:
                ext = '.' + img_url.split('.')[-1].split('?')[0].lower()
            else:
                ext = '.jpg'  # Default to jpg
        
        # Create S3 key using email (sanitized) as filename
        if email:
            # Sanitize email for filename (replace @ and . with -)
            safe_email = email.replace('@', '-at-').replace('.', '-')
            s3_key = f"{S3_FOLDER}{safe_email}{ext}"
        else:
            # Fallback to hash of image URL if no email
            img_hash = hashlib.md5(img_url.encode()).hexdigest()
            s3_key = f"{S3_FOLDER}{img_hash}{ext}"
        
        # Upload to S3
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=img_response.content,
            ContentType=content_type or 'image/jpeg'
        )
        
        # Return the S3 URL
        s3_url = f"https://{S3_BUCKET}.s3.us-east-2.amazonaws.com/{s3_key}"
        return s3_url
        
    except Exception as e:
        print(f"Error uploading profile photo: {e}")
        import traceback
        traceback.print_exc()
        return None

def vectorize_tags(tags):
    # Return an empty list if tags is empty
    if not tags:
        return []
    
    # Create vector
    embeddings = create_embeddings_batch(tags, max_workers=10)
    successful = [e for e in embeddings if e is not None]
    
    if not successful:
        return []
    
    vec = np.mean(np.array(embeddings), axis=0)

    # Normalize vector
    vec /= np.linalg.norm(vec)

    vec_list = [Decimal(str(x)) for x in vec.tolist()]

    return vec_list

def scrape_education(profile_soup):
    education = [] # Stores strings of format:
    # Degree,Major,University,GraduationYear
    
    # Find education in website
    section_tag = profile_soup.find(id="preparation")

    # Parse education in website
    if section_tag:
        entries = section_tag.select(".entry")

        for entry in entries:
            # Format entry into string
            parts = list(entry.stripped_strings) 
            first_part = parts[0].replace('"', '').strip()
            if " - " in first_part:
                title, field = first_part.split(" - ", 1)
            else:
                title, field = first_part, ""

            year = parts[-1].replace('"', '').replace("-", "").strip()
            university = parts[1].strip()

            # Append string to education
            education.append(f"{title},{field},{university},{year}")
        
        return education

def scrape_publications(driver):
    publications = []   # Stores dictionaries of format:
                        # "text": citation for publication
                        # "pdf": link to pdf

    while True:
        time.sleep(0.3)
        soup = BeautifulSoup(driver.page_source, "html.parser")
            
        section_tag = soup.find(id="publications")
            
        if section_tag:
            entries = section_tag.select(".entry")

            # Parse entries for publications
            for entry in entries:
                text = entry.get_text(separator=" ", strip=True)
                # Fix website formatting to remove "- publication" at the end
                text = text.replace("- publication", "").replace("- publications", "").strip()
                    
                # Get PDF link
                link_tag = entry.find("a")
                pdf_link = link_tag["href"] if link_tag else ""
                    
                # Append dictionary to publications
                publications.append({
                    "text": text,
                    "pdf": pdf_link
                })

        try:
            next_button = driver.find_element(By.CSS_SELECTOR, 'button[rel="next"]')
            next_button.click()
        except:
            return publications

def scrape_interests(profile_soup):
    # Find interests in website
    section_tag = profile_soup.find(id="areas")

    # Parse interests from website
    for tag_name in ['strong', 'h1', 'h3']:
        for tag in section_tag.find_all(tag_name):
            tag.decompose() # Remove text in <strong>, <h1>, <h3>

    # Reformat interests
    interests = re.sub(r'\s+', ' ', section_tag.text.strip().replace('Research Interests\n', ' ').replace('\t', ' ').replace('\n', ' ')).strip()

    return interests

def create_embedding(text: str) -> Optional[List[float]]:
    """Create embedding for a single text string."""
    try:
        response = bedrock_client.invoke_model(
            modelId=model_id,
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                'inputText': text
            })
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['embedding']
    
    except Exception as e:
        print(f"Error embedding text: {text[:50]}... - {e}")
        return None

def create_embeddings_batch(texts: List[str], max_workers: int = 10) -> List[Optional[List[float]]]:
    """Create embeddings for multiple texts concurrently."""
    embeddings = [None] * len(texts)
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_index = {
            executor.submit(create_embedding, text): i 
            for i, text in enumerate(texts)
        }
        
        # Collect results as they complete
        completed = 0
        for future in as_completed(future_to_index):
            index = future_to_index[future]
            embeddings[index] = future.result()
            completed += 1
    
    return embeddings
        
scrape_utd_profs(2)