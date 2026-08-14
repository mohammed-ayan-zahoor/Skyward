# 🚀 Skyward VPS Deployment Guide (PM2 + Nginx + MongoDB)

This guide walks you through deploying **Skyward** on your VPS using your existing **MongoDB** server, PM2, and Nginx. Zero Prisma setup required.

Skyward is configured to use dedicated non-conflicting ports:
- **Backend Express API**: Port `7001`
- **Frontend Next.js App**: Port `7005`
- **Nginx Reverse Proxy**: Receives traffic on Port `80` / `443` for your domain and routes internally to ports `7001` and `7005`.

---

## Step 1: Clone Skyward Project to Your Server

Navigate to your web directory (e.g. `/var/www/`):

```bash
cd /var/www
git clone https://github.com/mohammed-ayan-zahoor/Skyward.git skyward
cd skyward
```

---

## Step 2: Configure Environment Variables

### 1. Create `backend/.env`:
```bash
cp backend/.env.example backend/.env
nano backend/.env
```
Set your MongoDB connection string (pointing to your existing MongoDB server):
```env
PORT=7001
NODE_ENV=production
DATABASE_URL="mongodb://127.0.0.1:27017/skyward_db"
JWT_SECRET="generate_a_random_jwt_secret_here"
FRONTEND_URL="https://skyward.yourdomain.com"
```

### 2. Create `frontend/.env.local`:
```bash
nano frontend/.env.local
```
Set your public domain URL:
```env
NEXT_PUBLIC_API_URL="https://skyward.yourdomain.com"
```

---

## Step 3: Seed Database (Creates Default Admin User)

Run the Mongoose seed script to create your initial admin account (`admin@skywardkgf.com` / `Sky@563119`) and sample installations in MongoDB:

```bash
cd backend
npm install
npm run seed
cd ..
```

---

## Step 4: Execute 1-Click Deployment Script

Make `deploy-pm2.sh` executable and run it:

```bash
chmod +x deploy-pm2.sh
./deploy-pm2.sh
```

This automated script will:
1. Pull latest code from `main`.
2. Compile the Express TypeScript backend.
3. Build the Next.js production frontend.
4. Launch/Reload `skyward-backend` and `skyward-frontend` in PM2.

Check PM2 status:
```bash
pm2 status
```
You should see:
- `skyward-backend` online (Port 7001)
- `skyward-frontend` online (Port 7005)

---

## Step 5: Configure Nginx & SSL Certificate

### 1. Copy Nginx server block:
```bash
sudo cp nginx.skyward.conf /etc/nginx/sites-available/skyward.conf
sudo nano /etc/nginx/sites-available/skyward.conf
```
Replace `skyward.yourdomain.com` with your actual domain or subdomain name.

### 2. Enable the site and test Nginx config:
```bash
sudo ln -s /etc/nginx/sites-available/skyward.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Generate Free HTTPS/SSL Certificate via Certbot:
```bash
sudo certbot --nginx -d skyward.yourdomain.com
```

---

## 🔄 How to Update Skyward in the Future

Whenever you push new features or updates to GitHub, simply SSH into your server and run:

```bash
cd /var/www/skyward
./deploy-pm2.sh
```

Your server will update code, re-build Next.js, and perform a zero-downtime reload in PM2! 🎉
