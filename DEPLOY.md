# Deployment Guide — Me & Vi

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  ONE TIME (manual)                                          │
│  scp setup files → SSH → bash setup-server.sh              │
│  Installs: Node.js, Nginx, PM2, Certbot, SSL                │
└─────────────────────────┬───────────────────────────────────┘
                          │ done once, never again
┌─────────────────────────▼───────────────────────────────────┐
│  EVERY DEPLOY (automatic)                                   │
│  git push → GitHub Actions → builds → SSHs to EC2          │
│  → copies files → npm ci → pm2 restart                      │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
me-vi/
├── .github/workflows/deploy.yml   ← CI/CD (auto-deploys on push to main)
├── app/                           ← The entire application (React Router v7)
│   ├── app/                       ← Source code (components, routes, server code)
│   ├── build/                     ← Production build output (gitignored)
│   ├── uploads/                   ← Media files: photos, videos, music (gitignored)
│   ├── data.db                    ← SQLite database (auto-created, gitignored)
│   ├── .env                       ← Secrets (gitignored, created by GitHub Actions)
│   └── package.json
├── nginx.conf                     ← Nginx reverse proxy config
├── setup-server.sh                ← ONE-TIME system setup (scp + run manually)
└── backup/                        ← Old files kept for reference (gitignored)
```

## Requirements

| Requirement     | Details                                   |
| --------------- | ----------------------------------------- |
| **AWS EC2**     | `t4g.nano` (ARM64), Amazon Linux 2023     |
| **Domain**      | `my.eshant.click` (A record → EC2 IP)     |
| **GitHub Repo** | Push code here to trigger auto-deploy     |
| **Media files** | Photos, videos, music — uploaded manually |

---

## Step 1: Create EC2 Instance

1. Launch a **t4g.nano** instance with **Amazon Linux 2023** AMI (ARM64)
2. Security group — allow inbound: **SSH (22)**, **HTTP (80)**, **HTTPS (443)**
3. Create/download a `.pem` key pair
4. Allocate an **Elastic IP** and associate it with the instance
5. Point `my.eshant.click` A record to the Elastic IP

---

## Step 2: One-Time Server Setup

Run this **from your local machine**. Copy the two config files to EC2, then SSH in and run the setup script.

```bash
# From your local machine — copy setup files to EC2
scp -i your-key.pem setup-server.sh nginx.conf ec2-user@<EC2_IP>:~/

# SSH into EC2
ssh -i your-key.pem ec2-user@<EC2_IP>

# Run the one-time setup
bash setup-server.sh
```

**What `setup-server.sh` does (system-level only, no app code):**

1. Updates Amazon Linux 2023 packages
2. Installs Node.js 20, Nginx, Certbot, PM2, native build tools
3. Copies `nginx.conf` to `/etc/nginx/conf.d/` and starts Nginx
4. Runs Certbot to get a free SSL certificate (prompts for your email)
5. Registers PM2 as a systemd service (so app survives server reboots)

> **That's it for manual work.** The script does NOT touch your app code.
> App code is deployed entirely by GitHub Actions.

---

## Step 3: Set Up GitHub Actions Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions** → add these:

| Secret             | Value                                 |
| ------------------ | ------------------------------------- |
| `EC2_SSH_KEY`      | Contents of your `.pem` private key   |
| `EC2_HOST`         | EC2 Elastic IP (e.g. `3.110.xx.xx`)   |
| `JWT_SECRET`       | Any long random string (min 32 chars) |
| `JWT_EXPIRES_IN`   | `24h`                                 |
| `DEFAULT_USERNAME` | Your chosen login username            |
| `DEFAULT_PASSWORD` | Your chosen login password            |

> On first deployment, GitHub Actions creates the `.env` file on the server from these secrets.
> On subsequent deployments, `.env` already exists and is left untouched.

---

## Step 4: Upload Media Files

Media files are **not in the git repo** — upload them once manually:

```bash
scp -i your-key.pem -r app/uploads ec2-user@<EC2_IP>:/home/ec2-user/me-vi/app/
```

Expected structure on server:

```
/home/ec2-user/me-vi/app/uploads/
├── music/
│   └── happy-birthday.mp3
├── photos/
│   ├── single/
│   │   └── 11.jpg          (birthday card photo)
│   └── together/
│       ├── 1.jpg ... 7.jpg  (album photos)
│       └── 6.png
└── videos/
    └── sweet.mp4
```

---

## Step 5: First Deploy

Push code to `main` — GitHub Actions will build and deploy:

```bash
git add . && git commit -m "initial deploy" && git push origin main
```

**What GitHub Actions does on every push:**

1. Installs deps & builds the app (`npm ci` + `npm run build`) on a GitHub runner
2. SSHs into EC2 and copies built files (excludes `node_modules`, `backup/`, media)
3. On EC2: runs `npm ci --omit=dev`, rebuilds `better-sqlite3` for ARM64
4. Creates `.env` from GitHub secrets (only if it doesn't exist yet)
5. Runs `pm2 restart me-vi` (or starts it for the first time)

---

## Useful Commands (on EC2)

```bash
pm2 status                    # Check if app is running
pm2 logs me-vi                # View app logs
pm2 restart me-vi             # Restart app manually
sudo nginx -t                 # Test nginx config
sudo systemctl restart nginx  # Restart nginx
sudo certbot renew --dry-run  # Test SSL renewal
```
