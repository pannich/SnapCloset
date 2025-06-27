from fastapi import APIRouter, UploadFile, File, Form
from app.gpt_client import ask_gpt_about_images

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

@router.get("/hello/")
def say_hello():
    return {"message": "hello from /hello route"}

@router.post("/match-outfit/")
async def match_outfit(
    reference: UploadFile = File(...),
    others: list[UploadFile] = File(...)
):
    result = await ask_gpt_about_images(reference, others)
    return {"match": result}
