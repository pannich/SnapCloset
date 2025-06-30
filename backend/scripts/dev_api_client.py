import requests
import argparse
import json
import os

def send_text_request(url, data):
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers)
    return response

def send_styling_request(url, data):
    headers = {"Content-Type": "application/json"}
    response = requests.post(
        url, 
        json={
            "season": "summer",
            "selected_images": data
        }, headers=headers)
    return response

def main():
    parser = argparse.ArgumentParser(description="Dev API Client for SnapCloset Backend")
    parser.add_argument("--url", required=True, help="API endpoint URL")
    parser.add_argument("--payload", help="Path to JSON file with text payload")
    parser.add_argument("--images", nargs='*', help="IDs of image files to upload (space-separated)")
    args = parser.parse_args()

    # Handle file uploads
    if args.images:
        if len(args.images) > 2:
            print("⚠️  A maximum of 2 images can be sent at once.")
            return
        else:
            image_ids = [int(i) for i in args.images]
            print(f"📤 Sending images {image_ids} to {args.url}")
            response = send_styling_request(args.url, image_ids)
    # Handle JSON/text payload
    elif args.payload:
        with open(args.payload) as f:
            data = json.load(f)
        print(f"📤 Sending JSON payload to {args.url}")
        response = send_text_request(args.url, data)
    else:
        print("⚠️  Either --payload or --images must be provided.")
        return

    try:
        response.raise_for_status()
        print("✅ Response:\n", json.dumps(response.json(), indent=2))
    except requests.exceptions.HTTPError:
        print(f"❌ HTTP {response.status_code}:\n{response.text}")

if __name__ == "__main__":
    main()
