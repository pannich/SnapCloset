import json
from pathlib import Path

def log_json(payload: dict, log_path: str):
    Path(log_path).parent.mkdir(parents=True, exist_ok=True)
    with open(log_path, "a", encoding="utf-8") as log_file:
        log_file.write(json.dumps(payload) + "\n")
