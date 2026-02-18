#!/bin/bash
# ============================================================
# ONE-TIME SERVER SETUP SCRIPT
# ============================================================
# Purpose: Installs all system-level dependencies on a fresh
#          AWS EC2 Amazon Linux 2023 (ARM64) instance.
#
# This script does NOT touch your app code at all.
# GitHub Actions handles cloning, building, and running the app.
#
# Usage: From your LOCAL machine, run:
#   scp -i your-key.pem setup-server.sh nginx.conf ec2-user@<EC2_IP>:~/
#   ssh -i your-key.pem ec2-user@<EC2_IP>
#   bash setup-server.sh
#
# After this runs once, just push code to trigger auto-deploy.
# ============================================================

set -e

echo "=== [1/6] Updating system ==="
sudo dnf update -y

echo "=== [2/6] Installing Node.js 20 ==="
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

echo "=== [3/6] Installing Nginx ==="
sudo dnf install -y nginx

echo "=== [4/6] Installing Certbot for free SSL ==="
sudo dnf install -y certbot python3-certbot-nginx

echo "=== [5/6] Installing PM2 ==="
sudo npm install -g pm2

echo "=== [6/6] Installing native build tools (required for better-sqlite3) ==="
sudo dnf install -y gcc-c++ make python3

echo "=== [6/6] Configuring Nginx ==="
# Amazon Linux 2023 uses /etc/nginx/conf.d/ (no sites-available)
sudo cp ~/nginx.conf /etc/nginx/conf.d/me-vi.conf
sudo rm -f /etc/nginx/conf.d/default.conf
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx

echo "=== Getting SSL certificate ==="
read -p "Enter your email for SSL certificate notifications: " SSL_EMAIL
sudo certbot --nginx -d my.eshant.click --non-interactive --agree-tos -m "${SSL_EMAIL}"

echo "=== Enabling SSL auto-renewal ==="
sudo systemctl enable certbot.timer

echo "=== Registering PM2 as a system service ==="
# This ensures the app auto-starts if the server reboots
pm2 startup systemd -u ec2-user --hp /home/ec2-user | tail -1 | sudo bash

echo ""
echo "====================================================="
echo " Server setup complete!"
echo "====================================================="
echo ""
echo " Next steps:"
echo "   1. Add GitHub Actions secrets (see DEPLOY.md Step 3)"
echo "   2. Upload media files (see DEPLOY.md Step 4)"
echo "   3. git push to main — GitHub Actions deploys the app"
echo ""
echo " Useful commands later:"
echo "   pm2 status              - Check if app is running"
echo "   pm2 logs me-vi          - View app logs"
echo "   sudo nginx -t           - Test nginx config"
echo "   sudo certbot renew --dry-run  - Test SSL renewal"
