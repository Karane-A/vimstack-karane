# Server Not Running - Restart Instructions

## The Problem

"Connection refused" means the Laravel server (`php artisan serve`) is not running.

## Solution: Start the Server

### Step 1: Open Laragon Terminal

1. **Right-click Laragon icon** in system tray
2. Click **"Terminal"**
3. Or open Laragon app → Click **"Terminal"** button

### Step 2: Navigate to Project

```bash
cd "C:\Users\Windows10\Desktop\CEO\Vimstack\vimstack-karane"
```

### Step 3: Start Laravel Server

```bash
php artisan serve
```

**You MUST see this output:**
```
INFO  Server running on [http://127.0.0.1:8000]

  Press Ctrl+C to stop the server
```

**IMPORTANT:**
- ✅ Keep this terminal window **OPEN**
- ❌ Don't close it
- ❌ Don't press Ctrl+C
- The server runs in this window

### Step 4: Start Vite (In Separate Terminal)

**Open a NEW terminal/CMD window:**

```bash
cd "C:\Users\Windows10\Desktop\CEO\Vimstack\vimstack-karane"
npm run dev
```

**Keep this running too!**

### Step 5: Access Application

Once both servers are running:
- Open browser
- Visit: **http://localhost:8000**

## Quick Checklist

- [ ] Laragon Terminal opened
- [ ] Navigated to project directory
- [ ] Ran `php artisan serve`
- [ ] See "Server running on [http://127.0.0.1:8000]" message
- [ ] Terminal kept open (not closed)
- [ ] Vite server also running (`npm run dev`)
- [ ] Browser opened to http://localhost:8000

## Troubleshooting

### If Server Won't Start

1. **Check for errors in terminal** - scroll up to see any error messages

2. **Try different port:**
   ```bash
   php artisan serve --port=8001
   ```
   Then visit: http://localhost:8001

3. **Clear caches:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

4. **Verify PHP is working:**
   ```bash
   php --version
   php artisan --version
   ```

### If Port is Already in Use

```bash
# Find what's using port 8000
netstat -ano | findstr :8000

# Use different port
php artisan serve --port=8001
```

## Both Servers Must Be Running

**Terminal 1 (Laravel):**
```bash
php artisan serve
```

**Terminal 2 (Vite):**
```bash
npm run dev
```

**Both terminals must stay open!**

---

**The server must be running for the browser to connect. Start it now!**
