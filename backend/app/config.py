import os

# Now define reusable constants
ENV = os.getenv("ENV", "development")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
LOG_FILE = os.getenv("LOG_FILE", "logs/default.jsonl")
GENERATED_IMAGES_DIR = os.getenv("GENERATED_IMAGES_DIR", "data/images/generated")
RAW_IMAGES_DIR = os.getenv("RAW_IMAGES_DIR", "data/images/raw")
RAW_BASE64_IMAGES_DIR = os.getenv("RAW_BASE64_IMAGES_DIR", "data/images/raw_base64")