import json

def load_json(file_path):
    """Load JSON data from a file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def save_json(data, file_path):
    """Save JSON data to a file."""
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def merge_results(*files):
    """Merge the 'results' from all JSON files and remove duplicates based on 'place_id'."""
    combined_results = []
    seen_place_ids = set()

    # Iterate through each file's results
    for file in files:
        data = load_json(file)
        for result in data.get('results', []):
            place_id = result.get('name')
            if place_id not in seen_place_ids:
                combined_results.append(result)
                seen_place_ids.add(place_id)
    
    return combined_results

def main():
    # File paths for the three JSON files
    files = ['nepal.json', 'radius.json', 'ktm.json', 'clinics.json']
    
    # Merge results and remove duplicates
    merged_results = merge_results(*files)
    
    # Save the combined data to a new JSON file
    output_data = {"results": merged_results}
    save_json(output_data, 'combined_hospitals.json')

    print(f"Combined results saved to 'combined_results.json' with {len(merged_results)} unique entries.")

if __name__ == "__main__":
    main()
