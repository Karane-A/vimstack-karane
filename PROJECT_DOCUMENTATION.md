# Vimstack - Comprehensive Project Documentation

## 📋 Project Overview

**Vimstack** is a powerful, full-featured multi-store e-commerce platform built as a Software-as-a-Service (SaaS) solution, specifically customized for the Uganda market. It allows users to create, manage, and operate unlimited online stores from a single centralized dashboard. This platform is designed for entrepreneurs, agencies, and businesses looking to launch their own multi-tenant e-commerce platform with Uganda-specific features including UGX currency, local payment gateways, and Uganda tax configurations.

### Key Concept
The platform operates on a SaaS model where:
- **Platform Owners** can create subscription plans and manage multiple tenants
- **Store Owners** subscribe to plans and create their own branded online stores
- **Customers** shop at individual storefronts with unique themes and branding
- Each store operates independently with its own products, orders, customers, and settings

---

## 🏗️ Technology Stack

### Backend Framework
- **Laravel 12.x** - Modern PHP framework for robust backend architecture
- **PHP 8.2+** - Latest PHP version with enhanced performance and features

### Frontend Framework
- **React 19.x** - Latest React library for building interactive user interfaces
- **TypeScript 5.7+** - Type-safe JavaScript for better code quality
- **Inertia.js 2.0** - Modern approach to building SPAs without API complexity
- **Vite 6.0** - Next-generation frontend build tool for fast development

### UI/UX Libraries
- **Tailwind CSS 4.0** - Utility-first CSS framework for rapid UI development
- **Radix UI** - Unstyled, accessible component primitives
  - Dialog, Dropdown Menu, Select, Tabs, Popover, Tooltip, and more
- **Headless UI** - Unstyled, accessible UI components
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library for analytics
- **TipTap** - Rich text editor for content management

### State Management & Routing
- **Inertia.js** - Handles routing and data sharing between Laravel and React
- **React Context API** - For global state management (Cart, Wishlist, Theme, etc.)
- **Ziggy** - Laravel route helper for JavaScript

### Additional Frontend Tools
- **i18next** - Internationalization framework for multi-language support
- **date-fns** - Modern JavaScript date utility library
- **FullCalendar** - Calendar component for scheduling
- **React DnD** - Drag and drop functionality
- **QR Code Libraries** - For generating QR codes
- **Sonner** - Toast notification library

---

## 📦 Backend Dependencies (PHP/Composer)

### Core Framework
- `laravel/framework: ^12.0` - Laravel core framework
- `inertiajs/inertia-laravel: ^2.0` - Inertia.js Laravel adapter
- `tightenco/ziggy: ^2.4` - Route helper for JavaScript

### Authentication & Authorization
- `spatie/laravel-permission: ^6.18` - Role and permission management
- `lab404/laravel-impersonate: ^1.7` - User impersonation for admin support

### Payment Gateways (30+ Integrations)
- `stripe/stripe-php: ^17.3` - Stripe payment processing
- `razorpay/razorpay: ^2.8` - Razorpay (India)
- `mollie/mollie-api-php: ^3.1` - Mollie (Europe)
- `mercadopago/dx-php: ^2.5` - MercadoPago (Latin America)
- `paytabscom/laravel_paytabs: ^1.9` - PayTabs (Middle East)
- `cashfree/cashfree-pg: ^5.0` - Cashfree (India)
- `coingate/coingate-php: ^4.1` - CoinGate (Cryptocurrency)
- `iyzico/iyzipay-php: ^2.0` - Iyzico (Turkey)
- `yoomoney/yookassa-sdk-php: ^3.8` - YooKassa (Russia)
- `fedapay/fedapay-php: ^0.4.7` - FedaPay (Africa)
- `authorizenet/authorizenet: ^2.0` - Authorize.Net (US)
- And 20+ more payment gateway integrations

### Media & File Management
- `spatie/laravel-medialibrary: ^11.13` - Advanced media library for file management
- `league/flysystem-aws-s3-v3: ^3.29` - AWS S3 storage support

### AI Integration
- `openai-php/client: ^0.14.0` - OpenAI ChatGPT integration for AI-powered features

### Installation & Setup
- `rachidlaasri/laravel-installer: ^4.1` - Web-based installer for easy setup

### Development Tools
- `laravel/pail: ^1.2.2` - Real-time log viewer
- `laravel/pint: ^1.18` - Code style fixer
- `pestphp/pest: ^3.8` - Modern PHP testing framework
- `fakerphp/faker: ^1.23` - Fake data generator for testing

---

## 📦 Frontend Dependencies (Node.js/npm)

### Core React Libraries
- `react: ^19.0.0` - React library
- `react-dom: ^19.0.0` - React DOM renderer
- `@inertiajs/react: ^2.0.0` - Inertia.js React adapter

### UI Component Libraries
- `@radix-ui/react-*` - Multiple Radix UI components (Dialog, Dropdown, Select, Tabs, etc.)
- `@headlessui/react: ^2.2.0` - Headless UI components
- `lucide-react: ^0.475.0` - Icon library
- `class-variance-authority: ^0.7.1` - Component variant management
- `clsx: ^2.1.1` - Conditional className utility
- `tailwind-merge: ^3.0.1` - Merge Tailwind classes intelligently

### Styling
- `tailwindcss: ^4.0.0` - Tailwind CSS framework
- `@tailwindcss/vite: ^4.0.6` - Tailwind Vite plugin
- `tailwindcss-animate: ^1.0.7` - Animation utilities
- `tailwind-scrollbar: ^4.0.2` - Custom scrollbar styling

### Forms & Rich Text
- `@tiptap/react: ^2.23.0` - Rich text editor
- `@tiptap/starter-kit: ^2.23.0` - TipTap extensions
- `@tiptap/extension-*` - Additional TipTap extensions

### Charts & Data Visualization
- `recharts: ^3.1.2` - Composable charting library
- `@fullcalendar/react: ^6.1.17` - Calendar component

### Payment Processing (Frontend)
- `@stripe/react-stripe-js: ^3.7.0` - Stripe React components
- `@stripe/stripe-js: ^7.4.0` - Stripe.js library

### Internationalization
- `i18next: ^25.2.1` - Internationalization framework
- `react-i18next: ^15.5.3` - React bindings for i18next
- `i18next-browser-languagedetector: ^8.2.0` - Language detection
- `i18next-http-backend: ^3.0.2` - HTTP backend for translations

### Utilities
- `date-fns: ^4.1.0` - Date manipulation library
- `qrcode: ^1.5.4` - QR code generation
- `react-qr-code: ^2.0.18` - React QR code component
- `react-barcode: ^1.6.1` - Barcode generation
- `next-themes: ^0.4.6` - Dark mode support
- `sonner: ^2.0.3` - Toast notifications
- `cmdk: ^1.1.1` - Command menu component

### Build Tools
- `vite: ^6.0` - Build tool and dev server
- `@vitejs/plugin-react: ^4.3.4` - Vite React plugin
- `laravel-vite-plugin: ^1.0` - Laravel Vite integration
- `typescript: ^5.7.2` - TypeScript compiler
- `concurrently: ^9.0.1` - Run multiple commands concurrently

### Development Tools
- `eslint: ^9.17.0` - JavaScript linter
- `prettier: ^3.4.2` - Code formatter
- `prettier-plugin-tailwindcss: ^0.6.11` - Tailwind class sorting

---

## 🎨 Features & Capabilities

### 1. Multi-Store Management
- Create unlimited online stores from a single dashboard
- Each store operates independently with its own:
  - Products and inventory
  - Orders and customers
  - Payment gateways
  - Theme and branding
  - Settings and configurations

### 2. Store Themes (10+ Professional Themes)
- **Home & Accessories** (Default)
- **Fashion & Apparel**
- **Electronics & Technology**
- **Beauty & Cosmetics**
- **Jewelry & Accessories**
- **Watches & Timepieces**
- **Furniture & Interior**
- **Cars & Automotive**
- **Baby & Kids**
- **Perfume & Fragrances**

### 3. E-commerce Features
- **Product Management**
  - Product creation with variants, attributes, and options
  - Inventory tracking and stock management
  - Product categories and tags
  - Bulk import/export
  - Media gallery with multiple images
  
- **Order Management**
  - Order processing and fulfillment
  - Order status tracking
  - Invoice generation
  - Order history and analytics
  
- **Customer Management**
  - Customer profiles and accounts
  - Order history per customer
  - Customer segmentation
  - Customer reviews and ratings

### 4. Payment Gateway Integration (30+ Gateways)
- **Global**: Stripe, PayPal, Bank Transfer
- **India**: Razorpay, Cashfree, Paystack, Flutterwave, PayTabs
- **Europe**: Mollie, Skrill, CoinGate
- **Latin America**: MercadoPago
- **Middle East**: PayTabs, Tap Payments, Benefit
- **Africa**: FedaPay, Ozow
- **Asia**: Iyzico (Turkey), Khalti (Nepal), Aamarpay (Bangladesh), Midtrans (Indonesia)
- **Russia/CIS**: YooKassa
- **Cryptocurrency**: CoinGate
- And many more...

### 5. Subscription & SaaS Management
- **Subscription Plans**: Create multiple pricing tiers
- **Plan Management**: Features, limits, and pricing per plan
- **Plan Requests**: Users can request plan upgrades
- **Plan Orders**: Track subscription orders and payments
- **Trial Plans**: Support for trial periods
- **Coupon System**: Discount codes for plans and products

### 6. Role-Based Access Control (RBAC)
- **Granular Permissions**: Fine-grained permission system
- **Roles**: Pre-defined and custom roles
- **User Management**: Create, edit, and manage users
- **Impersonation**: Admin can impersonate users for support
- **Company Management**: Multi-company support

### 7. Blog System
- Built-in blog for each store
- Blog categories and tags
- SEO-friendly URLs
- Rich text editor for content creation
- Blog post scheduling

### 8. Analytics & Reporting
- Dashboard analytics
- Sales reports
- Customer analytics
- Product performance
- Revenue tracking
- Export capabilities (CSV, Excel)

### 9. Localization & Multi-Language
- **17+ Languages Supported**:
  - English, Spanish, French, German, Italian, Portuguese, Russian, Turkish, Arabic, Chinese, Japanese, Dutch, Polish, Hebrew, Danish, and more
- Language management interface
- Translation system for store content

### 10. Additional Features
- **POS System**: Point of Sale for physical stores
- **Express Checkout**: Quick checkout options
- **Wishlist**: Customer wishlist functionality
- **Coupon System**: Store-level and platform-level coupons
- **Tax Management**: Configure tax rates by location
- **Shipping Management**: Multiple shipping methods and zones
- **Newsletter System**: Email marketing integration
- **Custom Pages**: Create custom pages for stores
- **Email Templates**: Customizable email templates
- **Media Library**: Advanced media management
- **PWA Support**: Progressive Web App capabilities
- **AI Templates**: ChatGPT integration for content generation
- **Webhook System**: Custom webhooks for integrations
- **Referral System**: Affiliate/referral program
- **Currency Management**: Multi-currency support
- **Landing Page Builder**: Customizable landing pages

---

## 🗂️ Project Structure

```
vimstack-karane/
├── app/                          # Laravel application code
│   ├── Console/                  # Artisan commands
│   ├── Events/                    # Event classes
│   ├── Helpers/                   # Helper functions
│   ├── Http/
│   │   ├── Controllers/           # 115+ controllers
│   │   ├── Middleware/            # Custom middleware
│   │   └── Requests/              # Form request validation
│   ├── Libraries/                 # Third-party integrations
│   ├── Listeners/                 # Event listeners
│   ├── Mail/                      # Email classes
│   ├── Models/                    # 55+ Eloquent models
│   ├── Observers/                 # Model observers
│   ├── Policies/                  # Authorization policies
│   ├── Providers/                 # Service providers
│   ├── Services/                  # Business logic services
│   └── Traits/                    # Reusable traits
├── bootstrap/                     # Application bootstrap
├── build-ui/                      # UI build utilities
├── config/                        # Configuration files
├── database/
│   ├── factories/                 # Model factories
│   ├── migrations/                # 61+ database migrations
│   └── seeders/                   # 35+ database seeders
├── public/                        # Public assets
│   ├── installer/                 # Web installer assets
│   └── images/                    # Static images
├── resources/
│   ├── css/                       # Stylesheets
│   ├── js/                        # Frontend React/TypeScript code
│   │   ├── components/            # 279+ React components
│   │   ├── config/                # Configuration files
│   │   ├── contexts/              # React contexts
│   │   ├── data/                  # Static data
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # Layout components
│   │   ├── pages/                 # 305+ page components
│   │   ├── themes/                # Store theme configurations
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Utility functions
│   ├── lang/                      # Translation files (17+ languages)
│   └── views/                     # Blade templates
├── routes/                        # Route definitions
│   ├── auth.php                   # Authentication routes
│   ├── settings.php               # Settings routes
│   └── web.php                    # Main web routes
├── storage/                        # Storage directory
├── tests/                         # Test files
├── artisan                        # Laravel CLI
├── composer.json                  # PHP dependencies
├── package.json                   # Node.js dependencies
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Basic readme
```

---

## 🚀 Localhost Setup Instructions

### Prerequisites
- **PHP 8.2 or higher** with extensions:
  - BCMath, Ctype, cURL, DOM, Fileinfo, JSON, Mbstring, OpenSSL, PCRE, PDO, Tokenizer, XML
- **Composer** - PHP dependency manager
- **Node.js 18+** and **npm** (or yarn)
- **MySQL/MariaDB** or **PostgreSQL** or **SQLite** database
- **Web Server** (Apache/Nginx) or use Laravel's built-in server

### Step 1: Clone/Extract the Project
```bash
# If you have the project files, navigate to the directory
cd vimstack-karane
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Install Node.js Dependencies
```bash
npm install
```

### Step 4: Environment Configuration
```bash
# Copy the environment file (if .env.example exists)
# Otherwise, create a new .env file with the following minimum configuration:

APP_NAME="Vimstack SaaS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vimstack
DB_USERNAME=root
DB_PASSWORD=

# Generate application key
php artisan key:generate
```

### Step 5: Database Setup

**Option A: Using Web Installer (Recommended)**
1. Start the development server:
   ```bash
   php artisan serve
   ```
2. In another terminal, start Vite:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:8000` - you'll be redirected to the installer
4. Follow the web installer to set up your database

**Option B: Manual Database Setup**
```bash
# Create your database manually
# Then run migrations and seeders
php artisan migrate
php artisan db:seed
```

### Step 6: Start Development Servers

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

**Optional - Queue Worker (if using queues):**
```bash
php artisan queue:work
```

### Step 7: Access the Application

- **Main Application**: `http://localhost:8000`
- **Web Installer**: `http://localhost:8000/setup` (if not installed)
- **Admin Dashboard**: `http://localhost:8000/dashboard` (after login)

### Default Login Credentials

After running seeders, you can log in with:

**Super Admin:**
- Email: `superadmin@example.com`
- Password: `password`

**Admin:**
- Email: `admin@example.com`
- Password: `password`

---

## 🔧 Configuration Files

### Key Configuration Files to Review:

1. **`.env`** - Environment variables (database, mail, payment gateways, etc.)
2. **`config/app.php`** - Application configuration
3. **`config/database.php`** - Database connections
4. **`config/inertia.php`** - Inertia.js settings
5. **`config/permission.php`** - Permission system settings
6. **`config/role-permissions.php`** - Role and permission definitions
7. **`vite.config.ts`** - Vite build configuration
8. **`tailwind.config.js`** - Tailwind CSS customization
9. **`tsconfig.json`** - TypeScript compiler options

---

## 📊 Database Structure

The application uses **61+ migrations** to create tables for:
- Users, roles, and permissions
- Companies and stores
- Products, categories, and inventory
- Orders and order items
- Customers and addresses
- Payment gateways and transactions
- Subscription plans and orders
- Blog posts and categories
- Reviews and ratings
- Coupons and discounts
- Shipping methods and zones
- Tax rates
- Media library
- And more...

---

## 🌐 Supported Languages

The platform supports **17+ languages**:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt, pt-BR)
- Russian (ru)
- Turkish (tr)
- Arabic (ar)
- Chinese (zh, zh-CN, zh-TW)
- Japanese (ja)
- Dutch (nl)
- Polish (pl)
- Hebrew (he)
- Danish (da)
- And more...

---

## 🔐 Security Features

- **Role-Based Access Control (RBAC)** - Granular permissions
- **CSRF Protection** - Laravel's built-in CSRF tokens
- **XSS Protection** - Input sanitization
- **SQL Injection Prevention** - Eloquent ORM with parameter binding
- **Password Hashing** - Bcrypt/Argon2
- **Rate Limiting** - API and route rate limiting
- **Encryption** - Sensitive data encryption
- **Secure File Uploads** - File validation and storage

---

## 📱 Progressive Web App (PWA)

The platform includes PWA support:
- Service worker for offline functionality
- Web app manifest
- Installable on mobile devices
- Offline capabilities

---

## 🤖 AI Integration

- **OpenAI ChatGPT Integration** - AI-powered content generation
- **AI Templates** - Generate product descriptions, blog posts, etc.
- **Smart Content Suggestions** - AI-assisted content creation

---

## 🔌 API & Webhooks

- RESTful API endpoints
- Webhook system for third-party integrations
- Payment gateway webhooks
- Custom webhook support

---

## 📈 Performance Optimizations

- **Vite** - Fast build tool and HMR
- **Laravel Caching** - Query and route caching
- **Asset Optimization** - Minification and bundling
- **Lazy Loading** - Code splitting and lazy components
- **Database Indexing** - Optimized database queries

---

## 🧪 Testing

- **Pest PHP** - Modern PHP testing framework
- **Feature Tests** - 12+ feature test files
- **Unit Tests** - Unit test coverage
- **Test Factories** - Model factories for testing

---

## 📝 Development Workflow

### Recommended Development Commands:

```bash
# Install dependencies
composer install && npm install

# Start development servers
php artisan serve
npm run dev

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Build for production
npm run build

# Run tests
php artisan test
```

---

## 🎯 Use Cases

This platform is ideal for:
- **SaaS Entrepreneurs** - Launch your own multi-store platform
- **Agencies** - White-label solution for clients
- **E-commerce Businesses** - Manage multiple storefronts
- **Marketplace Operators** - Create a marketplace with multiple vendors
- **Franchise Operations** - Manage multiple franchise locations

---

## 📄 License

This is a premium CodeCanyon script. Please refer to your purchase license for usage terms and conditions.

---

## 🆘 Support & Resources

- Check the `README.md` for basic setup instructions
- Review Laravel documentation: https://laravel.com/docs
- Review React documentation: https://react.dev
- Review Inertia.js documentation: https://inertiajs.com

---

## 📌 Important Notes

1. **Environment Variables**: Make sure to configure all required environment variables in `.env`
2. **Payment Gateways**: Configure payment gateway credentials in `.env` or through the admin panel
3. **File Permissions**: Ensure `storage/` and `bootstrap/cache/` directories are writable
4. **Queue Workers**: For email sending and background jobs, run queue workers
5. **Cron Jobs**: Set up cron jobs for scheduled tasks (if applicable)
6. **SSL Certificate**: For production, use HTTPS for secure payment processing

---

## 🔄 Update Process

The platform includes a web installer that can:
- Detect new migrations
- Run database updates automatically
- Provide update status and error handling

---

*This documentation provides a comprehensive overview of the Vimstack platform. For specific implementation details, refer to the codebase and inline comments. For Uganda-specific setup and configuration, see VIMSTACK_UGANDA_GUIDE.md.*
