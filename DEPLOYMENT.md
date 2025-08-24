# Deployment Guide

This guide covers deploying the AI Multi-Agent Collaboration Lab to various platforms.

## 🚀 Production Deployment

### Backend Deployment (FastAPI)

#### Option 1: Traditional Server (Ubuntu/CentOS)

1. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Python and pip
   sudo apt install python3 python3-pip nginx -y
   
   # Install dependencies
   pip3 install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   # Create production .env file
   sudo nano /opt/ai-agent-lab/.env
   
   # Set proper permissions
   sudo chmod 600 /opt/ai-agent-lab/.env
   ```

3. **Setup Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/ai-agent-lab.service
   ```
   
   ```ini
   [Unit]
   Description=AI Multi-Agent Lab
   After=network.target
   
   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/opt/ai-agent-lab/backend
   Environment="PATH=/opt/ai-agent-lab/venv/bin"
   ExecStart=/opt/ai-agent-lab/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /ws {
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

#### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   EXPOSE 8000
   
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Docker Compose**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - OPENAI_API_KEY=${OPENAI_API_KEY}
         - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
         - GEMINIE_API_KEY=${GEMINIE_API_KEY}
         - STABILITY_API_KEY=${STABILITY_API_KEY}
         - PINECONE_API_KEY=${PINECONE_API_KEY}
       volumes:
         - ./backend:/app
       restart: unless-stopped
   
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       depends_on:
         - backend
       restart: unless-stopped
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

### Frontend Deployment (Next.js)

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

#### Option 2: Static Export + CDN

1. **Build Static Export**
   ```bash
   cd frontend
   npm run build
   npm run export
   ```

2. **Upload to CDN**
   Upload the `out/` folder to:
   - AWS S3 + CloudFront
   - Netlify
   - Cloudflare Pages

#### Option 3: Traditional Server

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "ai-agent-frontend" -- start
   pm2 save
   pm2 startup
   ```

## ☁️ Cloud Platform Deployments

### AWS

#### Backend on EC2

1. **Launch EC2 Instance**
   - Use Ubuntu 20.04 LTS
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Setup Load Balancer**
   ```bash
   # Application Load Balancer with WebSocket support
   # Target Group: EC2 instances running the backend
   ```

3. **RDS for Database** (if using database)
   ```bash
   # PostgreSQL or MySQL for persistent storage
   ```

#### Frontend on S3 + CloudFront

1. **S3 Bucket Setup**
   ```bash
   aws s3 mb s3://your-frontend-bucket
   aws s3 sync ./frontend/out s3://your-frontend-bucket
   ```

2. **CloudFront Distribution**
   - Origin: S3 bucket
   - Compress objects: Yes
   - Cache behaviors for static assets

### Google Cloud Platform

#### Backend on Cloud Run

1. **Build and Deploy**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/ai-agent-backend
   gcloud run deploy --image gcr.io/PROJECT-ID/ai-agent-backend --platform managed
   ```

#### Frontend on Firebase Hosting

1. **Initialize Firebase**
   ```bash
   npm install -g firebase-tools
   firebase init hosting
   ```

2. **Deploy**
   ```bash
   cd frontend
   npm run build
   firebase deploy
   ```

### Azure

#### Backend on Container Instances

1. **Create Container Registry**
   ```bash
   az acr create --resource-group myResourceGroup --name myregistry --sku Basic
   ```

2. **Deploy Container**
   ```bash
   az container create --resource-group myResourceGroup --name ai-agent-backend --image myregistry.azurecr.io/backend:latest
   ```

#### Frontend on Static Web Apps

1. **Deploy via GitHub Actions**
   ```yaml
   # .github/workflows/azure-static-web-apps.yml
   name: Azure Static Web Apps CI/CD
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v2
       - name: Build And Deploy
         uses: Azure/static-web-apps-deploy@v1
         with:
           azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
           repo_token: ${{ secrets.GITHUB_TOKEN }}
           action: "upload"
           app_location: "/frontend"
           output_location: "out"
   ```

## 🔒 Production Security

### SSL/TLS Configuration

1. **Let's Encrypt with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

2. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Environment Security

1. **Use Secrets Management**
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager
   - HashiCorp Vault

2. **Network Security**
   ```bash
   # Firewall rules
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

### API Rate Limiting

1. **Nginx Rate Limiting**
   ```nginx
   http {
       limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
       
       server {
           location /api/ {
               limit_req zone=api burst=20 nodelay;
           }
       }
   }
   ```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Health Checks**
   ```python
   # Add to FastAPI app
   @app.get("/health")
   async def health_check():
       return {"status": "healthy", "timestamp": datetime.now()}
   ```

2. **Prometheus Metrics**
   ```bash
   pip install prometheus-fastapi-instrumentator
   ```

### Log Management

1. **Structured Logging**
   ```python
   import structlog
   
   logger = structlog.get_logger()
   logger.info("Agent response", agent="openai", response_time=1.2)
   ```

2. **Log Aggregation**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Grafana + Loki
   - Cloud solutions (CloudWatch, Stackdriver)

## 🚀 Performance Optimization

### Backend Optimization

1. **Async Connection Pooling**
   ```python
   import aiohttp
   
   connector = aiohttp.TCPConnector(limit=100, limit_per_host=30)
   session = aiohttp.ClientSession(connector=connector)
   ```

2. **Caching**
   ```python
   import redis.asyncio as redis
   
   redis_client = redis.from_url("redis://localhost:6379")
   ```

### Frontend Optimization

1. **Next.js Optimization**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['api.yourdomain.com'],
     },
     webpack: (config) => {
       config.resolve.fallback = { fs: false };
       return config;
     },
   };
   ```

2. **CDN Configuration**
   ```javascript
   // Cache static assets aggressively
   // Cache API responses appropriately
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run tests
      run: |
        cd backend
        pip install -r requirements.txt
        pytest

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to server
      run: |
        # Deploy backend to your server
        
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Vercel
      run: |
        cd frontend
        npm install
        npm run build
        vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] SSL certificates obtained
- [ ] Database migrations completed
- [ ] API keys validated
- [ ] Load testing completed
- [ ] Security scan passed

### Post-deployment

- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan tested

### Maintenance

- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] Log analysis
- [ ] Backup verification
- [ ] Capacity planning
- [ ] Cost optimization

---

For support with deployment, contact the development team or refer to the main README.md file.
