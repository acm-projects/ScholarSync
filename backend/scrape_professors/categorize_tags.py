import json

def categorize(tags):
    # Load in tags json
    with open('src/data/tags.json', 'r') as file:
        categories = json.load(file)
    
    