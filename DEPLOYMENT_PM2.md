# 🚀 Skyward VPS Deployment Guide (PM2 + Nginx + PostgreSQL)

This guide walks you through deploying **Skyward** on your VPS alongside your existing PM2, Nginx, and MongoDB applications.

Skyward is configured to use dedicated non-conflicting ports:
- **Backend Express API**: Port `7001`
- **Frontend Next.js App**: Port `7005`
- **Nginx Reverse Proxy**: Receives traffic on Port `80` / `443` for your domain and routes internally to ports `7001` and `7005`.

---

## Step 1: Install & Set Up PostgreSQL (One-Time Setup)

If PostgreSQL is not already installed on your server:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

Log in to PostgreSQL CLI and create the `skyward_db` database and user:

```bash
sudo -u postgres psql
```

Inside the `psql` prompt, run:

```sql
CREATE DATABASE skyward_db;
CREATE USER skyward_user WITH PASSWORD 'choose_a_strong_password';
GRANT ALL PRIVILEGES ON DATABASE skyward_db TO skyward_user;
ALTER DATABASE skyward_db OWNER TO skyward_user;
\q
```

---

## Step 2: Clone Skyward Project to Your Server

Navigate to your web directory (e.g. `/var/www/`):

```bash
cd /var/www
git clone https://github.com/mohammed-ayan-zahoor/Skyward.git skyward
cd skyward
```

---

## Step 3: Configure Environment Variables

### 1. Create `backend/.env`:
```bash
cp backend/.env.example backend/.env
nano backend/.env
```
Update `DATABASE_URL` with the password you created in Step 1:
```env
PORT=7001
NODE_ENV=production
DATABASE_URL="postgresql://skyward_user:choose_a_strong_password@localhost:5432/skyward_db?schema=public"
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

## Step 4: Run Initial Seed (Creates Default Admin User)

Run the Prisma seed command to generate your initial admin account (`admin@skywardcanopies.com` / `admin123`):

```bash
cd backend
npx prisma db seed
cd ..
```

---

## Step 5: Execute 1-Click Deployment Script

Make `deploy-pm2.sh` executable and run it:

```bash
chmod +x deploy-pm2.sh
./deploy-pm2.sh
```

This automated script will:
1. Pull latest code from `main`.
2. Run database migrations via Prisma (`prisma migrate deploy`).
3. Compile the Express TypeScript backend.
4. Build the Next.js production frontend.
5. Launch/Reload `skyward-backend` and `skyward-frontend` in PM2.

Check PM2 status:
```bash
pm2 status
```
You should see:
- `skyward-backend` online (Port 7001)
- `skyward-frontend` online (Port 7005)

---

## Step 6: Configure Nginx & SSL Certificate

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

Your server will update code, run database migrations, re-build Next.js, and perform a zero-downtime reload in PM2! 🎉
