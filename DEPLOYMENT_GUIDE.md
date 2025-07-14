# Betting SRL - Debian 12 Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Betting SRL Italian casino and sports betting platform on a Debian 12 VM.

## Prerequisites

### System Requirements
- Debian 12 (Bookworm) VM
- Minimum 2GB RAM (4GB recommended)
- 20GB+ disk space
- Internet connection
- SSH access (recommended)

### Services You'll Need
- **PostgreSQL Database** (Neon DB recommended or local PostgreSQL)
- **GNews API Key** (optional, for sports news)
- **SendGrid API Key** (optional, for email functionality)
- **Domain name** (optional, for production setup)

## Step 1: Initial System Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Essential Packages
```bash
sudo apt install -y curl wget git build-essential software-properties-common
```

## Step 2: Install Node.js 20

### Install Node.js via NodeSource Repository
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js 20
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

## Step 3: Install PostgreSQL (if not using external DB)

### Install PostgreSQL 15
```bash
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE betting_srl;"
sudo -u postgres psql -c "CREATE USER betting_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE betting_srl TO betting_user;"
sudo -u postgres psql -c "ALTER USER betting_user CREATEDB;"
```

## Step 4: Install Process Manager (PM2)

```bash
sudo npm install -g pm2
```

## Step 5: Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 6: Setup SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 7: Download and Setup the Application

### Create Application Directory
```bash
sudo mkdir -p /var/www/betting-srl
sudo chown $USER:$USER /var/www/betting-srl
cd /var/www/betting-srl
```

### Download Project Files
**Option A: Export from Replit**
1. In Replit, go to Tools → Export
2. Download the ZIP file
3. Upload to your server:
```bash
# Upload the ZIP file to your server (use scp, sftp, or web upload)
unzip betting-srl.zip
cd betting-srl
```

**Option B: Clone from Git (if you have a repository)**
```bash
git clone https://github.com/yourusername/betting-srl.git .
```

### Install Dependencies
```bash
npm install --production
```

## Step 8: Environment Configuration

### Create Production Environment File
```bash
nano .env.production
```

### Add Required Environment Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://betting_user:your_secure_password@localhost:5432/betting_srl"

# Or for Neon DB (recommended)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/betting_srl?sslmode=require"

# Session Security
SESSION_SECRET="your-super-secure-session-secret-at-least-32-characters-long"

# External APIs (Optional)
GNEWS_API_KEY="your_gnews_api_key_here"
SENDGRID_API_KEY="your_sendgrid_api_key_here"

# Production Settings
NODE_ENV="production"
PORT=5000
```

### Set Environment Variables
```bash
# Make environment file executable
chmod 600 .env.production

# Export variables for current session
export $(grep -v '^#' .env.production | xargs)
```

## Step 9: Database Setup

### Run Database Migrations
```bash
npm run db:push
```

## Step 10: Build the Application

### Build Frontend and Backend
```bash
npm run build
```

### Verify Build Success
```bash
ls -la dist/
# Should show: index.js and public/ directory
```

## Step 11: Configure PM2 for Process Management

### Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'betting-srl',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_file: '.env.production',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'dist/public'],
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### Create Logs Directory
```bash
mkdir -p logs
```

### Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 12: Configure Nginx Reverse Proxy

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/betting-srl
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Static files
    location /assets/ {
        alias /var/www/betting-srl/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /uploads/ {
        alias /var/www/betting-srl/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/betting-srl /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Step 13: Setup SSL Certificate (Production)

### Generate SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Setup Auto-renewal
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 14: Configure Firewall

```bash
# Install ufw if not installed
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Step 15: Setup Log Rotation

### Create Log Rotation Configuration
```bash
sudo nano /etc/logrotate.d/betting-srl
```

```bash
/var/www/betting-srl/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reload betting-srl
    endscript
}
```

## Step 16: Setup Monitoring (Optional)

### Install and Configure htop
```bash
sudo apt install -y htop
```

### Monitor Application
```bash
# Check PM2 status
pm2 status
pm2 logs

# Check system resources
htop

# Check Nginx status
sudo systemctl status nginx

# Check application logs
tail -f /var/www/betting-srl/logs/combined.log
```

## Step 17: Setup Backup Script

### Create Backup Directory
```bash
sudo mkdir -p /backups/betting-srl
```

### Create Backup Script
```bash
nano /var/www/betting-srl/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/betting-srl"
APP_DIR="/var/www/betting-srl"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database (if using local PostgreSQL)
if [ "$DATABASE_URL" != *"neon.tech"* ]; then
    sudo -u postgres pg_dump betting_srl > $BACKUP_DIR/db_backup_$DATE.sql
fi

# Backup uploads directory
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C $APP_DIR uploads/

# Backup environment file
cp $APP_DIR/.env.production $BACKUP_DIR/env_backup_$DATE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*backup*" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Make Script Executable and Setup Cron
```bash
chmod +x /var/www/betting-srl/backup.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add this line:
0 2 * * * /var/www/betting-srl/backup.sh >> /var/www/betting-srl/logs/backup.log 2>&1
```

## Step 18: Performance Optimization

### Optimize Node.js for Production
```bash
# In your .env.production file, add:
echo "NODE_OPTIONS=--max-old-space-size=1024" >> .env.production
```

### Setup Redis for Session Storage (Optional)
```bash
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Update your application to use Redis for sessions
# (You'll need to modify the session configuration in your app)
```

## Step 19: Final Testing and Verification

### Test the Application
```bash
# Check if application is running
curl http://localhost:5000

# Check if Nginx is serving correctly
curl http://your-domain.com

# Check database connection
pm2 logs betting-srl | grep -i "database"

# Check SSL certificate (if configured)
curl -I https://your-domain.com
```

### Verify All Services
```bash
# Check all services status
sudo systemctl status nginx
sudo systemctl status postgresql  # if using local DB
pm2 status
```

## Step 20: Post-Deployment Tasks

### Create Admin User
1. Visit your website: https://your-domain.com
2. The system will automatically create an admin user on first run
3. Check the logs for the admin credentials:
```bash
pm2 logs betting-srl | grep -i "admin"
```

### Configure DNS (if using custom domain)
1. Point your domain's A record to your server's IP address
2. Wait for DNS propagation (up to 48 hours)
3. Run SSL certificate generation again if needed

## Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   pm2 logs betting-srl
   pm2 restart betting-srl
   ```

2. **Database connection issues**
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

### Performance Monitoring
```bash
# Monitor CPU and memory usage
htop

# Monitor application logs
pm2 monit

# Check disk usage
df -h

# Monitor network connections
netstat -tulpn | grep :5000
```

## Security Checklist

- [ ] Firewall configured and enabled
- [ ] SSL certificate installed and auto-renewing
- [ ] Strong database passwords
- [ ] Secure session secret (32+ characters)
- [ ] Regular security updates scheduled
- [ ] Backup system configured
- [ ] Non-root user for application
- [ ] File permissions properly set
- [ ] Log rotation configured
- [ ] Monitoring system in place

## Maintenance Tasks

### Weekly
- [ ] Check application logs for errors
- [ ] Monitor disk usage
- [ ] Check backup integrity
- [ ] Update system packages: `sudo apt update && sudo apt upgrade`

### Monthly
- [ ] Review security logs
- [ ] Check SSL certificate expiration
- [ ] Performance optimization review
- [ ] Database maintenance (if using local PostgreSQL)

## Support

For issues related to:
- **Database**: Check your PostgreSQL or Neon DB connection
- **API Keys**: Verify GNews and SendGrid API keys in environment variables
- **SSL**: Run `sudo certbot renew` to refresh certificates
- **Performance**: Monitor with `pm2 monit` and `htop`

## Useful Commands

```bash
# Application management
pm2 start betting-srl
pm2 stop betting-srl
pm2 restart betting-srl
pm2 reload betting-srl
pm2 logs betting-srl

# System monitoring
htop
df -h
free -h
systemctl status nginx
systemctl status postgresql

# Log viewing
tail -f /var/www/betting-srl/logs/combined.log
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

This deployment guide provides a complete production setup for your Betting SRL platform on Debian 12. The setup includes security best practices, performance optimization, monitoring, and backup strategies.