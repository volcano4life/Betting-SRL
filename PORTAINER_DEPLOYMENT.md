# Portainer Deployment Guide for Betting SRL

This guide provides step-by-step instructions to deploy the Betting SRL application using Portainer's Docker Compose functionality.

## 📋 Prerequisites

- **Portainer** installed and running
- **Docker Engine** on your server
- **Domain name** pointed to your server (for SSL)
- **GitHub repository** with your Betting SRL code

## 🚀 Step 1: Prepare Portainer Environment

### 1.1 Access Portainer
1. Open Portainer in your browser: `https://your-server:9443`
2. Log in with your admin credentials
3. Select your Docker environment

### 1.2 Create Environment Variables
1. Go to **Environments** → **[Your Environment]** → **Environment variables**
2. Add the following variables:

```
POSTGRES_PASSWORD=your_secure_db_password_here
SESSION_SECRET=your_very_secure_session_secret_here_minimum_32_characters
GNEWS_API_KEY=your_gnews_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
DOMAIN=yourdomain.com
```

## 🚀 Step 2: SSL Certificate Setup

### Option A: Let's Encrypt (Recommended)
Connect to your server via SSH and run:

```bash
# Install Certbot
sudo apt update && sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Create SSL directory in Portainer volumes
sudo mkdir -p /var/lib/docker/volumes/betting-srl-ssl/_data
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/lib/docker/volumes/betting-srl-ssl/_data/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /var/lib/docker/volumes/betting-srl-ssl/_data/
sudo chown -R root:root /var/lib/docker/volumes/betting-srl-ssl/_data/
```

### Option B: Self-Signed Certificate (Development)
```bash
sudo mkdir -p /var/lib/docker/volumes/betting-srl-ssl/_data
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /var/lib/docker/volumes/betting-srl-ssl/_data/privkey.pem \
    -out /var/lib/docker/volumes/betting-srl-ssl/_data/fullchain.pem \
    -subj "/C=IT/ST=Italy/L=Rome/O=BettingSRL/CN=yourdomain.com"
```

## 🚀 Step 3: Create Portainer-Compatible Docker Compose

### 3.1 Navigate to Stacks
1. In Portainer, go to **Stacks**
2. Click **+ Add stack**
3. Name your stack: `betting-srl`

### 3.2 Use Web Editor
Select **Web editor** and paste this Portainer-optimized compose file:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: betting-srl-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: betting_srl
      POSTGRES_USER: betting_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - betting-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U betting_user -d betting_srl"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Application Server
  app:
    image: ghcr.io/yourusername/betting-srl:latest
    container_name: betting-srl-app
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://betting_user:${POSTGRES_PASSWORD}@postgres:5432/betting_srl
      SESSION_SECRET: ${SESSION_SECRET}
      GNEWS_API_KEY: ${GNEWS_API_KEY}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
      PORT: 5000
    ports:
      - "5000:5000"
    volumes:
      - uploads:/app/uploads
      - assets:/app/attached_assets
    networks:
      - betting-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Application Builder (for GitHub builds)
  app-builder:
    build:
      context: https://github.com/yourusername/betting-srl.git
      dockerfile: Dockerfile
    image: ghcr.io/yourusername/betting-srl:latest
    container_name: betting-srl-builder
    profiles:
      - build
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: betting-srl-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - type: bind
        source: /var/lib/docker/volumes/betting-srl-ssl/_data
        target: /etc/nginx/ssl
        read_only: true
      - nginx_cache:/var/cache/nginx
      - nginx_config:/etc/nginx/conf.d
    networks:
      - betting-network
    depends_on:
      - app
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf

volumes:
  postgres_data:
    driver: local
  nginx_cache:
    driver: local
  nginx_config:
    driver: local
  uploads:
    driver: local
  assets:
    driver: local

networks:
  betting-network:
    driver: bridge

configs:
  nginx_conf:
    external: true
```

### 3.3 Environment Variables
In the **Environment variables** section, add:
```
POSTGRES_PASSWORD=your_secure_db_password_here
SESSION_SECRET=your_very_secure_session_secret_here_minimum_32_characters
GNEWS_API_KEY=your_gnews_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

## 🚀 Step 4: Create Nginx Configuration

### 4.1 Create Nginx Config
1. Go to **Configs** in Portainer
2. Click **+ Add config**
3. Name: `nginx_conf`
4. Content:

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        application/javascript
        application/json
        application/xml
        text/css
        text/javascript
        text/plain
        text/xml;

    # Cache settings
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=betting_cache:10m max_size=100m inactive=60m use_temp_path=off;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream application server
    upstream betting_app {
        server app:5000;
        keepalive 32;
    }

    # HTTP server (redirects to HTTPS)
    server {
        listen 80;
        server_name _;
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Redirect all HTTP traffic to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name _;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Root location
        location / {
            proxy_pass http://betting_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300;
            proxy_connect_timeout 300;
            proxy_send_timeout 300;
        }

        # API endpoints with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            limit_req_status 429;
            
            proxy_pass http://betting_app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets with caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://betting_app;
            proxy_set_header Host $host;
            
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary Accept-Encoding;
            
            proxy_cache betting_cache;
            proxy_cache_valid 200 1y;
            proxy_cache_valid 404 1m;
        }

        # Health check
        location /api/health {
            access_log off;
            proxy_pass http://betting_app;
            proxy_set_header Host $host;
        }
    }
}
```

## 🚀 Step 5: Alternative - Using Git Repository Build

If you prefer to build from your GitHub repository directly:

### 5.1 Fixed Compose for Direct GitHub Build
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: betting-srl-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: betting_srl
      POSTGRES_USER: betting_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - betting-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U betting_user -d betting_srl"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: https://github.com/yourusername/betting-srl.git#main
      dockerfile: Dockerfile
    image: betting-srl-app:local
    container_name: betting-srl-app
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://betting_user:${POSTGRES_PASSWORD}@postgres:5432/betting_srl
      SESSION_SECRET: ${SESSION_SECRET}
      GNEWS_API_KEY: ${GNEWS_API_KEY}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
      PORT: 5000
    ports:
      - "5000:5000"
    volumes:
      - uploads:/app/uploads
      - assets:/app/attached_assets
    networks:
      - betting-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: betting-srl-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/lib/docker/volumes/betting-srl-ssl/_data:/etc/nginx/ssl:ro
      - nginx_cache:/var/cache/nginx
    networks:
      - betting-network
    depends_on:
      - app
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf

volumes:
  postgres_data:
  nginx_cache:
  uploads:
  assets:

networks:
  betting-network:

configs:
  nginx_conf:
    external: true
```

## 🚀 Step 6: Deploy the Stack

### 6.1 Deploy Stack
1. Click **Deploy the stack**
2. Wait for Portainer to pull images and start containers
3. Monitor the deployment in **Containers** section

### 6.2 Initialize Database
1. Go to **Containers**
2. Click on `betting-srl-app` container
3. Click **Console** → **Connect**
4. Run: `npm run db:push`

## 🔧 Step 7: Verify Deployment

### 7.1 Check Container Health
1. Go to **Containers**
2. Verify all containers show "healthy" status:
   - `betting-srl-db` (healthy)
   - `betting-srl-app` (healthy)
   - `betting-srl-nginx` (healthy)

### 7.2 Test Application
```bash
# Test health endpoint
curl http://your-server:5000/api/health

# Test through nginx
curl https://yourdomain.com/api/health
```

## 🚨 Troubleshooting Common Portainer Issues

### Issue 1: GitHub Branch Reference Error
**Problem**: `repository does not contain ref master` error
**Solution**: GitHub repositories now use "main" as default branch. Specify the branch:
```yaml
build:
  context: https://github.com/yourusername/betting-srl.git#main
  dockerfile: Dockerfile
image: betting-srl-app:local
```

### Issue 2: GitHub Container Registry Error
**Problem**: `denied` error when trying to pull non-existent image
**Solution**: The compose tries to pull `ghcr.io/yourusername/betting-srl:latest` which doesn't exist. Use the build context instead:
```yaml
build:
  context: https://github.com/yourusername/betting-srl.git#main
  dockerfile: Dockerfile
image: betting-srl-app:local  # Use local tag instead of registry
```

### Issue 3: Private Repository Access
**Problem**: Cannot access private repository during build
**Solution**: Use GitHub token in build context:
```yaml
build:
  context: https://username:token@github.com/yourusername/betting-srl.git#main
```

### Issue 2: Volume Mounting
**Problem**: SSL certificates not found
**Solution**: Use absolute paths for bind mounts:
```yaml
volumes:
  - type: bind
    source: /var/lib/docker/volumes/betting-srl-ssl/_data
    target: /etc/nginx/ssl
    read_only: true
```

### Issue 3: Environment Variables
**Problem**: Variables not being passed
**Solution**: Define in both stack environment and compose environment sections

### Issue 4: Network Issues
**Problem**: Services cannot communicate
**Solution**: Ensure all services use the same network:
```yaml
networks:
  - betting-network
```

## 📊 Monitoring in Portainer

### Container Logs
1. Go to **Containers**
2. Click container name
3. Click **Logs** tab
4. Use **Auto-refresh logs** for real-time monitoring

### Resource Usage
1. Go to **Containers**
2. View **Stats** column for CPU/Memory usage
3. Click container for detailed metrics

### Stack Management
1. Go to **Stacks**
2. Click `betting-srl` stack
3. Use **Editor** to modify configuration
4. Click **Update the stack** to apply changes

## 🔄 Updating the Application

### Method 1: Rebuild from Git
1. Go to **Stacks** → `betting-srl`
2. Enable **Re-pull image and redeploy**
3. Click **Update the stack**

### Method 2: Update Specific Service
1. Go to **Containers**
2. Select `betting-srl-app`
3. Click **Recreate**
4. Enable **Pull latest image**

## 🔐 Security Best Practices

### 1. Use Secrets Management
1. Go to **Secrets**
2. Create secrets for sensitive data
3. Reference in compose file:
```yaml
secrets:
  - postgres_password
  - session_secret
```

### 2. Network Isolation
- Use custom networks
- Avoid exposing unnecessary ports
- Use internal network for inter-service communication

### 3. Resource Limits
```yaml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
```

Your Betting SRL application is now deployed via Portainer with full container orchestration, monitoring, and management capabilities!

## 📞 Support

For Portainer-specific issues:
1. Check container logs in Portainer UI
2. Verify environment variables are set correctly
3. Ensure all volumes are properly mounted
4. Check network connectivity between services