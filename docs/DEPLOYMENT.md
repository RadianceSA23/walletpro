# Enterprise Deployment Guide (AWS EC2, ECR, Docker Compose & GitHub Actions)

This document provides a production deployment guide for provisioning, deploying, and maintaining the **Expense Tracker SaaS** application on AWS EC2 behind an Nginx reverse proxy with SSL termination and automated GitHub Actions CI/CD.

---

## 1. Cloud Architecture Overview

```
                                  [ DNS / Cloudflare ]
                                           |
                                  HTTPS (Port 443 - SSL)
                                           v
                             +---------------------------+
                             | AWS EC2 (Ubuntu 22.04 LTS)|
                             |                           |
                             |  +---------------------+  |
                             |  |   Nginx Proxy &     |  |
                             |  | Let's Encrypt SSL   |  |
                             |  +----------+----------+  |
                             |             |             |
                             |   Docker Network Bridge   |
                             |             v             |
                             |  +---------------------+  |
                             |  |   Frontend (React)  |  |
                             |  +---------------------+  |
                             |  |   Backend (NestJS)  |  |
                             |  +----------+----------+  |
                             +-------------|-------------+
                                           |
                                 MongoDB Wire Protocol
                                           v
                             +---------------------------+
                             |   MongoDB Atlas Cluster   |
                             +---------------------------+
```

---

## 2. Required GitHub Secrets

To enable the automated CI/CD pipeline (`.github/workflows/deploy.yml`), configure the following secrets under **Repository Settings -> Secrets and variables -> Actions**:

| Secret Key | Description | Example Value |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key with ECR access | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_ACCOUNT_ID` | 12-digit AWS Account Number | `123456789012` |
| `EC2_HOST` | Public IP or DNS domain of EC2 instance | `54.210.12.34` or `api.expensetracker.com` |
| `EC2_USERNAME` | SSH user (typically `ubuntu`) | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH Key (`.pem` file content) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://admin:password@cluster.mongodb.net/expense_tracker` |
| `JWT_SECRET` | Secret key for 15-min access tokens | `production_secure_access_token_secret` |
| `JWT_REFRESH_SECRET` | Secret key for 7-day refresh tokens | `production_secure_refresh_token_secret` |

---

## 3. AWS EC2 Server Initial Provisioning

Execute the following commands once on a fresh Ubuntu 22.04 LTS EC2 instance (`t3.medium` recommended):

### Step 3.1: Install Docker & Docker Compose
```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable Docker service & add user permissions
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

### Step 3.2: Install AWS CLI v2
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Step 3.3: Setup Application Directory & Environment Configuration
```bash
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app
```

Create `/home/ubuntu/app/docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-backend:latest
    container_name: expense_tracker_backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      NODE_ENV: production
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      JWT_EXPIRATION: 15m
      JWT_REFRESH_EXPIRATION: 7d
      CORS_ORIGIN: https://expensetracker.com

  frontend:
    image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-frontend:latest
    container_name: expense_tracker_frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## 4. Let's Encrypt SSL Certificate Setup (Nginx Host Reverse Proxy)

```bash
# Install Certbot & Nginx plugin
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Obtain SSL Certificate
sudo certbot --nginx -d expensetracker.com -d www.expensetracker.com
```

Configure Nginx site configuration (`/etc/nginx/sites-available/default`):
```nginx
server {
    server_name expensetracker.com www.expensetracker.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/expensetracker.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/expensetracker.com/privkey.pem;
}
```

---

## 5. Rollback Procedure

If a deployed commit encounters an unexpected runtime anomaly, run the manual rollback sequence via SSH:

```bash
cd /home/ubuntu/app

# Pull previous stable commit SHA tagged image from ECR
docker pull 123456789012.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-backend:<STABLE_COMMIT_SHA>

# Re-deploy containers
docker compose up -d --remove-orphans

# Verify container health status
curl http://localhost:5000/api/v1/health
```
