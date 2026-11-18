import os
import json
import boto3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from botocore.exceptions import BotoCoreError, ClientError

app = FastAPI(title="Environmental Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BUCKET_NAME = os.getenv("BUCKET_NAME", "")

@app.get("/api/health")
def health():
    return {
        "status": "running",
        "application": "Environmental Monitoring System",
        "cloud": "AWS"
    }

@app.get("/api/readings")
def get_readings():
    if not BUCKET_NAME:
        raise HTTPException(status_code=503, detail="S3 bucket is not configured")

    try:
        s3 = boto3.client("s3")

        response = s3.list_objects_v2(
            Bucket=BUCKET_NAME,
            Prefix="sensor-readings/"
        )

        objects = response.get("Contents", [])
        objects.sort(key=lambda item: item["LastModified"], reverse=True)

        readings = []

        for item in objects[:20]:
            file = s3.get_object(
                Bucket=BUCKET_NAME,
                Key=item["Key"]
            )

            reading = json.loads(file["Body"].read().decode("utf-8"))
            readings.append(reading)

        return {
            "source": "Amazon S3",
            "count": len(readings),
            "readings": readings
        }

    except (BotoCoreError, ClientError) as error:
        raise HTTPException(status_code=502, detail=str(error))
    except (ValueError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=500, detail=str(error))
