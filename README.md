# ENVIRONTRACK
## Intelligent IoT Environmental Monitoring System

### Project Overview
ENVIRONTRACK is a Dockerized IoT environmental monitoring application integrated with AWS cloud services.

It monitors simulated temperature and humidity readings and displays historical sensor data through a web dashboard.

### Architecture

Simulated DHT11 Sensor
        |
        v
AWS IoT Core
        |
        v
AWS IoT Rule
        |
        v
AWS Lambda
        |
        v
Amazon S3
        |
        v
Docker Backend (FastAPI)
        |
        v
Docker Frontend (React + Nginx)
        |
        v
Environmental Monitoring Dashboard

### Technologies Used

- AWS IoT Core
- AWS Lambda
- Amazon S3
- Amazon CloudWatch
- Python
- FastAPI
- React.js
- Vite
- Nginx
- Docker
- Docker Compose
- Boto3

### Project Features

- Temperature monitoring
- Humidity monitoring
- Historical sensor readings
- Cloud-based data storage
- Interactive dashboard
- REST API
- Docker containerization
- Container health checks
- AWS cloud integration

### Project Structure

backend/
    app/
    Dockerfile
    requirements.txt

frontend/
    src/
    Dockerfile
    nginx.conf

docker-compose.yml
.gitignore
.env

### Prerequisites

- Docker Desktop
- AWS Academy Learner Lab credentials
- Windows PowerShell

### Run the Application

1. Clone the repository.
2. Configure AWS credentials in the .env file.
3. Start Docker Desktop.
4. Run:

docker compose up -d --build

### Access Application

Dashboard:
http://localhost:3000

Health API:
http://localhost:3000/api/health

Sensor Readings API:
http://localhost:3000/api/readings

### Verify Containers

docker compose ps

### Stop Application

docker compose down

### Security

- AWS credentials are stored in a local .env file.
- The .env file must never be uploaded to GitHub.
- S3 public access remains blocked.

### Note

Sensor readings in this demonstration are simulated.
No physical sensor hardware is connected.

### Project Title

IoT-Based Environmental Monitoring System Using AWS Cloud Services and Docker.
