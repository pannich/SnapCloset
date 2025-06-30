import base64
from datetime import datetime, timezone
from pathlib import Path

import requests
from app.utils.logger import log_json
from openai import OpenAI
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.config import LOG_FILE, OPENAI_API_KEY, GENERATED_IMAGES_DIR, RAW_IMAGES_DIR, RAW_BASE64_IMAGES_DIR

router = APIRouter()
client = OpenAI(api_key=OPENAI_API_KEY)

class Prompt(BaseModel):
    prompt: str

class StylingRequest(BaseModel):
    season: str = "summer"
    selected_images_indices: list[int] = [0]

@router.post("/chat-text-text")
def chat_text_text(prompt: Prompt):
    try:
        user_input = prompt.prompt
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt.prompt}],
            max_tokens=50
        )

        output = response.choices[0].message.content
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_input": user_input,
            "output": output,
            "model": response.model,
            "response_id": response.id,
            "usage": response.usage.model_dump()
        }

        log_json(log_entry, LOG_FILE)

        return {
            "response": output,
            "tokens_used": log_entry["usage"]
        }
    except Exception as e:
        error_msg = f"Error during chat-text-text: {str(e)}"
        print(error_msg)
        return {"error": error_msg}


@router.post("/chat-text-image")
def chat_text_image(prompt: Prompt):
    try:
        user_input = prompt.prompt
        model_used = "dall-e-3"

        response = client.images.generate(
            model=model_used,
            prompt=prompt.prompt,
            size="1024x1024",
            n=1
        )

        image_url = response.data[0].url
        timestamp = datetime.now(timezone.utc).isoformat()
        response_id = response.created

        # Prepare filename and save path
        safe_timestamp = timestamp.replace(":", "-")
        filename = f"{safe_timestamp}_{response_id}.png"
        save_path = Path(GENERATED_IMAGES_DIR)
        save_path.mkdir(parents=True, exist_ok=True)
        image_path = save_path / filename

        # Download and save image
        img_data = requests.get(image_url).content
        with open(image_path, "wb") as f:
            f.write(img_data)

        # Log the interaction
        log_entry = {
            "timestamp": timestamp,
            "user_input": user_input,
            "image_url": image_url,
            "image_path": str(image_path),
            "model": model_used,
            "response_id": response_id
        }


        log_json(log_entry, LOG_FILE)

        return {
            "image_url": image_url
        }
    except Exception as e:
        error_msg = f"Error during chat-text-image: {str(e)}"
        print(error_msg)
        return {"error": error_msg}
    


# multi-modal endpoint: images to images
@router.post("/get-styling-advice")
def get_styling_advice(request: StylingRequest, bg: BackgroundTasks):
    # Process input
    season = request.season
    selected_images_indices = request.selected_images_indices

    # select images from /raw_images
    images_dir = Path(RAW_IMAGES_DIR)
    images_files = list(images_dir.glob("*.jpg")) + list(images_dir.glob("*.png"))
    selected_images = [images_files[i] for i in selected_images_indices if i < len(images_files)]

    # convert selected images to base64 if not exists in /raw_base64
    base64_dir = Path(RAW_BASE64_IMAGES_DIR)
    base64_dir.mkdir(parents=True, exist_ok=True)
    b64_list = []
    for img in selected_images:
        txt = base64_dir / (img.stem + ".txt")
        if not txt.exists():
            with open(img, "rb") as f:
                b64_txt = base64.b64encode(f.read()).decode("utf-8")
                b64_list.append(b64_txt)
            with open(txt, "w") as f:
                f.write(b64_txt)
        else:
            with open(txt, "r") as f:
                b64_str = f.read()
                b64_list.append(b64_str)

    # Construct input for the model
    styles = ["casual", "edgy", "preppy", "cute"]
    # styles = ["casual", "edgy", "preppy", "cute"]
    input_content = []
    for variant in styles:
        prompt = (
            f"Provide a stylish {season} outfit with a {variant} vibe. "
            "The lighting is soft and natural. Flat lay photography style. "
            "Must include all items from the provided image(s)."
        )
        content = [{"type": "input_text", "text": prompt}]
        content += [
            {"type": "input_image", "image_url": f"data:image/jpeg;base64,{b}"}
            for b in b64_list
        ]
        input_content.append({"type": "message", "role": "user", "content": content})
        try:
            # Call the Responses API with the image generation tool
            response = client.responses.create(
                model="gpt-4o",
                input=input_content,
                tools=[{"type": "image_generation"}],
                temperature=0.7,
            )

            print(response.model_dump_json(indent=2))

            output_images = []
            output_texts = []
            for block in response.output:
                if block.type == "message":
                    content = block.content
                    output_texts.extend([dic.text for dic in content if dic.type == "output_text"])
                elif block.type == "image_generation_call":
                    img_data = base64.b64decode(block.result)
                    ts = datetime.now(timezone.utc).isoformat().replace(":", "-")
                    filename = f"{variant}_.png"
                    save_dir = Path(GENERATED_IMAGES_DIR)
                    save_dir.mkdir(parents=True, exist_ok=True)
                    filepath = save_dir / filename
                    filepath.write_bytes(img_data)
                    output_images.append(str(filepath))

            # Log outcome
            log_json({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "selected_images": [str(img) for img in selected_images],
                "model": response.model,
                "response_id": response.id,
                "usage": response.usage.model_dump(),
                "output_texts": output_texts,
                "output_images": output_images,
            }, LOG_FILE)

            return {
                "response_texts": output_texts,
                "response_images": output_images
            }

        except Exception as e:
            error = f"Error during get-styling-advice: {str(e)}"
            print(error)
            return {"error": error}

    
    
