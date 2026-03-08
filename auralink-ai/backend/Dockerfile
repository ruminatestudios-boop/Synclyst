# AuraLink AI - FastAPI backend
FROM python:3.12-slim

WORKDIR /app

# System deps: for building grpcio/cryptography, and tesseract for pytesseract at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    libssl-dev \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Prefer wheels (avoids build failures for grpcio/cryptography on some builders)
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App
COPY app/ ./app/

# Default: run uvicorn (app.main:app). Cloud Run sets PORT.
ENV PYTHONPATH=/app
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
