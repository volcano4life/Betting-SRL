# Docker Deployment Guide for Betting SRL

This guide will help you deploy the Betting SRL application using Docker Compose on any server with Docker installed.

## 📋 Prerequisites

- **Docker Engine** 20.10+ installed
- **Docker Compose** v2.0+ installed
- **Domain name** pointed to your server (for SSL)
- **Server** with at least 2GB RAM and 20GB storage

## 🚀 Quick Deployment

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/betting-srl.git
cd betting-srl
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Configuration:**
```env
# Strong database password
POSTGRES_PASSWORD=your_secure_db_password_here

# Secure session secret (32+ characters)
SESSION_SECRET=your_very_secure_session_secret_here_minimum_32_characters

# Optional API keys
GNEWS_API_KEY=your_gnews_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Your domain
DOMAIN=yourdomain.com
```

### Step 3: SSL Certificate Setup

**Option A: Let's Encrypt (Recommended)**
```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Create SSL directory
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/
sudo chown $USER:$USER ssl/*
```

**Option B: Self-Signed Certificate (Development)**
```bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/privkey.pem \
    -out ssl/fullchain.pem \
    -subj "/C=IT/ST=Italy/L=Rome/O=BettingSRL/CN=yourdomain.com"
```

### Step 4: Deploy Application

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Step 5: Initialize Database

```bash
# Wait for services to be healthy
docker-compose exec app npm run db:push

# Verify database connection
docker-compose exec postgres psql -U betting_user -d betting_srl -c "SELECT version();"
```

## 🔧 Service Management

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Application
```bash
docker-compose restart app
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f nginx
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache app
docker-compose up -d
```

## 📊 Monitoring

### Health Checks
```bash
# Check service health
docker-compose ps

# Test application endpoint
curl -f http://localhost:5000/api/health

# Test nginx
curl -f http://localhost/health
```

### Resource Usage
```bash
# View resource usage
docker stats

# Check disk usage
docker system df
```

## 🔒 Security Configuration

### Firewall Setup
```bash
# Install UFW
sudo ufw enable

# Allow essential ports
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS

# Block direct database access
sudo ufw deny 5432
```

### SSL Certificate Renewal
```bash
# Create renewal script
cat > /etc/cron.d/certbot-renewal << 'EOF'
0 0,12 * * * root /usr/bin/certbot renew --quiet --deploy-hook "cd /path/to/betting-srl && docker-compose restart nginx"
EOF
```

## 🗄️ Database Management

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U betting_user betting_srl > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
docker-compose exec postgres pg_dump -U betting_user betting_srl | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore Database
```bash
# Stop application
docker-compose stop app

# Restore backup
docker-compose exec -T postgres psql -U betting_user betting_srl < backup_file.sql

# Start application
docker-compose start app
```

### Database Migrations
```bash
# Apply schema changes
docker-compose exec app npm run db:push

# Generate migration (if using drizzle-kit)
docker-compose exec app npm run db:generate
```

## 🚨 Troubleshooting

### Common Issues

**1. Port 80/443 Already in Use**
```bash
# Check what's using the ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

**2. Database Connection Issues**
```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U betting_user -d betting_srl -c "SELECT 1;"
```

**3. SSL Certificate Issues**
```bash
# Verify certificate files
ls -la ssl/
openssl x509 -in ssl/fullchain.pem -text -noout

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

**4. Application Won't Start**
```bash
# Check application logs
docker-compose logs app

# Check environment variables
docker-compose exec app env | grep -E "(DATABASE_URL|SESSION_SECRET)"

# Restart with fresh build
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Performance Optimization

**1. Enable Docker BuildKit**
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

**2. Optimize Images**
```bash
# Clean up unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

**3. Resource Limits**
```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
```

## 📈 Production Recommendations

### 1. Load Balancing
For high traffic, add multiple app instances:

```yaml
# In docker-compose.yml
app:
  # ... existing config
  deploy:
    replicas: 3
```

### 2. External Database
For production, use managed PostgreSQL:

```yaml
# Remove postgres service
# Update DATABASE_URL to external database
DATABASE_URL=postgresql://user:pass@external-db-host:5432/betting_srl
```

### 3. CDN Integration
Configure Nginx to work with CDN:

```nginx
# Add to nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    # CDN headers
    add_header Cache-Control "public, max-age=31536000";
    add_header Access-Control-Allow-Origin "*";
}
```

### 4. Monitoring Stack
Add monitoring with Prometheus and Grafana:

```bash
# Download monitoring stack
curl -O https://raw.githubusercontent.com/docker/awesome-compose/master/prometheus-grafana/docker-compose.yml
```

## 🔄 Maintenance

### Regular Tasks

**Daily:**
- Check service health: `docker-compose ps`
- Review logs: `docker-compose logs --tail=100 app`

**Weekly:**
- Update images: `docker-compose pull`
- Clean up: `docker system prune`
- Backup database

**Monthly:**
- Update SSL certificates (automated with Let's Encrypt)
- Review security logs
- Update dependencies

### Scaling

**Horizontal Scaling:**
```bash
# Scale application containers
docker-compose up -d --scale app=3
```

**Vertical Scaling:**
```yaml
# Increase resources in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '1.0'
```

## 📞 Support

### Log Collection
```bash
# Collect all logs for support
mkdir -p support-logs/$(date +%Y%m%d)
docker-compose logs > support-logs/$(date +%Y%m%d)/docker-compose.log
docker-compose ps > support-logs/$(date +%Y%m%d)/services-status.txt
docker system df > support-logs/$(date +%Y%m%d)/disk-usage.txt
```

### Useful Commands
```bash
# Enter application container
docker-compose exec app bash

# Database shell
docker-compose exec postgres psql -U betting_user betting_srl

# Nginx configuration test
docker-compose exec nginx nginx -t

# View real-time metrics
docker stats
```

---

Your Betting SRL application is now ready for production deployment with Docker! 🚀