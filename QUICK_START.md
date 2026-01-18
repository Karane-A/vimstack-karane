# Quick Start Guide - Vimstack SaaS

## ⚡ Quick Setup (After Prerequisites are Installed)

### Prerequisites Required

Before running the setup, ensure you have:

1. **PHP 8.2+** installed and in your PATH
2. **Composer** installed and in your PATH  
3. **Node.js 18+** (✅ Already installed: v24.12.0)
4. **MySQL/MariaDB** or **PostgreSQL** or **SQLite** database

### Installation Steps

#### 1. Install PHP Dependencies
```bash
composer install
```

#### 2. Install Node.js Dependencies
```bash
npm install
```

#### 3. Generate Application Key
```bash
php artisan key:generate
```

#### 4. Configure Database

Edit the `.env` file and set your database credentials:

**For MySQL:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vimstack
DB_USERNAME=root
DB_PASSWORD=your_password
```

**For SQLite (Easier for testing):**
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Then create the SQLite database file:
```bash
# Windows PowerShell
New-Item -ItemType File -Path "database\database.sqlite" -Force
```

#### 5. Run Database Setup

**Option A: Use Web Installer (Recommended)**
```bash
# Terminal 1 - Start Laravel server
php artisan serve

# Terminal 2 - Start Vite dev server
npm run dev
```

Then visit: http://localhost:8000 (you'll be redirected to installer)

**Option B: Manual Setup**
```bash
# Create database first (for MySQL/PostgreSQL)
# Then run:
php artisan migrate
php artisan db:seed
```

#### 6. Start Development Servers

You need **TWO terminals** running:

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
npm run dev
```

#### 7. Access the Application

- **Main App**: http://localhost:8000
- **Admin Login**: http://localhost:8000/login

**Default Credentials:**
- Email: `superadmin@example.com`
- Password: `password`

---

## 🚨 If PHP/Composer Not Found

### Install PHP on Windows

1. **Download PHP:**
   - Visit: https://windows.php.net/download/
   - Download PHP 8.2+ Thread Safe ZIP
   - Extract to `C:\php`

2. **Add to PATH:**
   - Open System Properties → Environment Variables
   - Add `C:\php` to System PATH
   - Restart terminal

3. **Enable Extensions:**
   - Copy `php.ini-development` to `php.ini`
   - Uncomment required extensions in `php.ini`:
     ```
     extension=curl
     extension=fileinfo
     extension=gd
     extension=mbstring
     extension=mysqli
     extension=pdo_mysql
     extension=openssl
     extension=zip
     ```

### Install Composer on Windows

1. **Download Composer:**
   - Visit: https://getcomposer.org/download/
   - Download `Composer-Setup.exe`
   - Run installer (it will detect PHP automatically)

2. **Verify Installation:**
   ```bash
   composer --version
   ```

### Alternative: Use XAMPP/WAMP

1. **Download XAMPP:**
   - Visit: https://www.apachefriends.org/
   - Install XAMPP (includes PHP, MySQL, Apache)

2. **Add PHP to PATH:**
   - Usually located at: `C:\xampp\php`
   - Add to System PATH

3. **Use XAMPP MySQL:**
   - Start MySQL from XAMPP Control Panel
   - Use `root` with no password (default)

---

## 📋 Complete Setup Checklist

- [ ] PHP 8.2+ installed and in PATH
- [ ] Composer installed
- [ ] Node.js 18+ installed (✅ Done)
- [ ] Database server installed (MySQL/PostgreSQL/SQLite)
- [ ] Run `composer install`
- [ ] Run `npm install`
- [ ] Copy `env.template` to `.env` (✅ Done)
- [ ] Run `php artisan key:generate`
- [ ] Configure database in `.env`
- [ ] Run `php artisan migrate` (or use web installer)
- [ ] Run `php artisan db:seed` (or use web installer)
- [ ] Start `php artisan serve`
- [ ] Start `npm run dev`
- [ ] Visit http://localhost:8000

---

## 🎯 Next Steps After Setup

1. **Change Default Passwords** - Update admin credentials
2. **Configure Payment Gateways** - Add API keys in `.env` or admin panel
3. **Set Up Email** - Configure SMTP in `.env`
4. **Create Your First Store** - Log in and create a test store
5. **Explore Themes** - Check out the 10+ available store themes

---

## 📚 Documentation Files

- **PROJECT_DOCUMENTATION.md** - Comprehensive project overview
- **SETUP_LOCALHOST.md** - Detailed setup instructions
- **README.md** - Basic project information

---

## 🆘 Troubleshooting

### "PHP not found"
→ Install PHP and add to PATH (see above)

### "Composer not found"  
→ Install Composer (see above)

### "Database connection error"
→ Check database credentials in `.env`
→ Ensure database server is running
→ Verify database exists

### "Vite manifest not found"
→ Make sure `npm run dev` is running

### "Class not found"
→ Run `composer dump-autoload`

---

**Need Help?** Check the detailed guides:
- `SETUP_LOCALHOST.md` for step-by-step instructions
- `PROJECT_DOCUMENTATION.md` for technical details
