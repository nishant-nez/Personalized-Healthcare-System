import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_photo(photo_reference, max_width=1200):
    """Get the photo URL from the Google Places API."""
    url = "https://maps.googleapis.com/maps/api/place/photo"
    params = {
        "photoreference": photo_reference,
        "maxwidth": max_width,
        "key": os.environ.get('GOOGLE_MAP_API_KEY'),
    }
    response = requests.get(url, params=params)
    return response.url

def main():
    # Load the JSON data
    with open("combined_hospitals.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    # Get the photo URL for each hospital
    for hospital in data["results"]:
        if "photos" in hospital:
            photo_reference = hospital["photos"][0]["photo_reference"]
            photo_url = get_photo(photo_reference)
            hospital["photo_url"] = photo_url

    # Save the updated data
    with open("combined_hospitals_pic.json", "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    print(f"Photo URLs added to 'combined_hospitals_pic.json'.")


if __name__ == "__main__":
    main()