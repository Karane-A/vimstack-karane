# How to Start Development Servers

## Using Laragon (Windows)

### Step 1: Start Laragon
1. Open Laragon application
2. Click "Start All"

### Step 2: Open Laragon Terminal
- Right-click Laragon → Select "Terminal"
- Or press: `Ctrl + Alt + T`

### Step 3: Navigate to Project
```bash
cd C:\Users\Windows10\Desktop\CEO\Vimstack\vimstack-karane
```

### Step 4: Start Development Servers

Open **TWO** Laragon terminal windows:

#### Terminal 1 - Laravel Server:
```bash
php artisan serve
```
This starts the backend server at: http://localhost:8000

#### Terminal 2 - Vite Dev Server:
```bash
npm run dev
```
This starts the frontend build server at: http://localhost:5173

### Step 5: Open Browser
Visit: **http://localhost:8000**

---

## Quick Start Script (Alternative)

If PHP is in your PATH, you can also run:
```bash
.\start-dev.ps1
```

This will open both servers in separate windows automatically.

---

## Troubleshooting

### If you see "PHP not found":
- Make sure Laragon is running
- Use Laragon's terminal (not regular PowerShell)
- Or add PHP to your PATH:
  - Laragon → Menu → Tools → Path → Add Laragon to Path

### If you see "npm not found":
```bash
# In Laragon terminal:
nvm use 24.12.0
```

### Database not configured:
- The application will redirect to the installer at: http://localhost:8000/install
- Follow the setup wizard

---

## What You'll See After Starting

1. **Laravel Server (Terminal 1):**
   ```
   Starting Laravel development server: http://127.0.0.1:8000
   [Press Ctrl+C to quit]
   ```

2. **Vite Server (Terminal 2):**
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

3. **Browser:** 
   - Navigate to http://localhost:8000
   - You should see the login page (since we removed the landing page)
   - Or the installer if it's first run

---

## Changes Made Today

✅ Removed Brand Settings from vendor dashboard
✅ Removed SMTP Settings from vendor dashboard  
✅ Completely removed Landing Page feature
✅ Home route now redirects to login

