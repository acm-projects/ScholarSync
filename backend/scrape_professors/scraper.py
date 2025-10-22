import boto3
import re
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

BASE_URL = 'https://profiles.utdallas.edu/browse'

dynamodb = boto3.resource('dynamodb')
professor_table = dynamodb.Table('UTD_Professor')

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
                "profile_url": profile_url
            }

            # Skip empty strings, None, and empty lists
            item = {
                k: v for k, v in item.items()
                if v not in (None, '') and not (isinstance(v, list) and len(v) == 0)
            }

            # If professor_id is missing, skip this record
            if 'email' not in item:
                continue

            # Add professor to UTD_Professors table
            professor_table.put_item(Item=item)

def scrape_name(contact_info_tag):
    h1_name_tag = contact_info_tag.find('h1')
    
    full_name = ''
    if h1_name_tag:
        full_name = h1_name_tag.text.strip()
    
    return full_name

def scrape_titles(contact_info_tag):
    div_titles = contact_info_tag.find('div', class_='profile-titles')

    titles = []
    if div_titles:
        div_title_tags = div_titles.find_all('div', class_='profile-title')

        for div in div_title_tags:
            titles.append(div.text.strip())
        
    return titles

def scrape_summary(contact_info_tag):
    p_summary_tag = contact_info_tag.find('p', class_='profile_summary')
    
    summary = ''
    if p_summary_tag:
        summary = p_summary_tag.text.strip()

    return summary

def scrape_email(driver):
    time.sleep(0.5) # wait 0.5 seconds

    email_tag = driver.find_element(By.CSS_SELECTOR, 'a[data-evaluate="profile-eml"]')

    email = ''
    if email_tag:
        email = email_tag.text.strip()
    
    return email

def scrape_tags(contact_info_tag):
    research_tags_tag = contact_info_tag.find("span", class_="tags")
    
    tags = []
    if research_tags_tag:
        linked_tags = research_tags_tag.find_all("a")

        for link in linked_tags:
            tags.append(link.text.strip())
    
    return tags

def scrape_education(profile_soup):
    education = [] # Stores strings of format:
    # Degree,Major,University,GraduationYear
    
    section_tag = profile_soup.find(id="preparation")

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
    section_tag = profile_soup.find(id="areas")

    for tag_name in ['strong', 'h1', 'h3']:
        for tag in section_tag.find_all(tag_name):
            tag.decompose() # Remove text in <strong>, <h1>, <h3>

    interests = re.sub(r'\s+', ' ', section_tag.text.strip().replace('Research Interests\n', ' ').replace('\t', ' ').replace('\n', ' ')).strip()

    return interests
        
scrape_utd_profs(1)