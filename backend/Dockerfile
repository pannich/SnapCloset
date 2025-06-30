# Start with lightweight Python base
FROM python:3.11-slim

# Set working directory
WORKDIR /project

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    git \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Optional: install your project in editable mode
# COPY app ./app
ENV PYTHONPATH=/project

# Optional: expose both FastAPI and Jupyter ports
EXPOSE 8000

# Copy .env if needed (don't include in production build)
# COPY .env .

# Default command runs FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
