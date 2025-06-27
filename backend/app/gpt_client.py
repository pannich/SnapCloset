import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_DEV_KEY")

async def ask_gpt_about_images(reference_image, other_images):
    print("Asking GPT about images...")
    def image_part(file: UploadFile):
        return {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{file.file.read().decode('utf-8')}"
            }
        }

    messages = [
        {"role": "system", "content": "You are a helpful fashion stylist."},
        {"role": "user", "content": [
            {"type": "text", "text": "This is the reference outfit:"},
            image_part(reference_image),
            {"type": "text", "text": "Please review the other outfits and pick one that complements the reference outfit the most."},
        ] + [image_part(img) for img in other_images]}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=messages
    )

    return response['choices'][0]['message']['content']
