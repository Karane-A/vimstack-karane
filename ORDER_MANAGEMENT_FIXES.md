# Order Management Fixes

## Issues Fixed

### 1. **Customer Records Not Created for Guest Orders** ✅
**Problem:** When guests placed orders, no customer record was created in the customer management module.

**Solution:**
- Modified `OrderService::createOrder()` to automatically create customer records for guest checkouts
- Guest customers are created with `customer_group = 'guest'` and no password
- Existing customers are found by email to avoid duplicates

**Files Changed:**
- `app/Services/OrderService.php`

---

### 2. **Previous Orders Not Linked When Customer Registers** ✅
**Problem:** When a guest customer created an account, their previous orders didn't show in their customer profile.

**Solution:**
- Modified `AuthController::register()` to link all previous orders by email when a customer creates an account
- Guest customer records are merged into the new registered customer account
- Orders are transferred using email matching

**Files Changed:**
- `app/Http/Controllers/Store/AuthController.php`

---

### 3. **Tracking Number Not Displaying** ✅
**Problem:** Tracking numbers weren't showing in the order details page.

**Solution:**
- Verified that tracking numbers are already being passed correctly from `OrderController::show()`
- The field exists in the database and is properly displayed in the frontend

**Files Verified:**
- `app/Http/Controllers/OrderController.php` (line 116)
- `resources/js/pages/orders/show.tsx` (line 50)

---

### 4. **Payment Method Not Showing Correctly** ✅
**Problem:** Payment methods were showing as raw values instead of friendly names.

**Solution:**
- Payment method names are already being formatted correctly in `OrderController::show()`
- Uses proper name mapping (e.g., 'cod' → 'Cash on Delivery')

**Files Verified:**
- `app/Http/Controllers/OrderController.php` (line 84)

---

### 5. **Order Timeline Showing Incorrect Timestamps** ✅
**Problem:** When an order was completed, all timeline statuses reverted to "Order Processing" because they all used `updated_at`.

**Solution:**
- Created migration to add dedicated timestamp fields:
  - `confirmed_at`
  - `processing_at`
  - `shipped_at` (already existed)
  - `delivered_at` (already existed)
  - `cancelled_at`
  - `refunded_at`
  - `payment_confirmed_at`

- Updated `OrderController::update()` to automatically set these timestamps when status changes
- Updated timeline display to use specific timestamps instead of `updated_at`
- Updated payment success handlers (Stripe, PayPal, PayFast) to set timestamps

**Files Changed:**
- `database/migrations/2026_01_18_000000_add_status_timestamps_to_orders_table.php` (NEW)
- `app/Models/Order.php`
- `app/Http/Controllers/OrderController.php`
- `app/Http/Controllers/Store/StripeController.php`
- `app/Http/Controllers/Store/PayPalController.php`
- `app/Http/Controllers/Store/PayFastController.php`

---

## Database Migration Required

Run the following command to apply the database changes:

```bash
php artisan migrate
```

This will add the new timestamp columns to the `orders` table.

---

## How It Works Now

### Guest Checkout Flow:
1. Customer places order without logging in
2. System creates/finds customer record by email
3. Order is linked to customer record
4. Customer appears in Customer Management module

### Customer Registration Flow:
1. Guest places order (customer record created)
2. Later, guest creates account with same email
3. System automatically links all previous orders to new account
4. Customer can see order history immediately

### Order Status Timeline:
1. **Order Placed** - Uses `created_at`
2. **Payment Confirmed** - Uses `payment_confirmed_at`
3. **Order Processing** - Uses `processing_at`
4. **Shipped** - Uses `shipped_at`
5. **Delivered** - Uses `delivered_at`

Each status now has its own timestamp, so the timeline shows accurate progression.

---

## Testing Checklist

- [ ] Place order as guest → Customer appears in Customer Management
- [ ] Guest places order → Registers with same email → Orders appear in profile
- [ ] Update order status to "Processing" → Timeline shows correct time
- [ ] Update order status to "Shipped" → Timeline shows different time for each status
- [ ] Complete payment via Stripe/PayPal → Payment Confirmed timestamp is set
- [ ] Check tracking number displays correctly in order details
- [ ] Verify payment method shows friendly name (e.g., "Cash on Delivery")

---

## Notes

- Guest customers have `customer_group = 'guest'` and `password = null`
- Registered customers have `customer_group = 'regular'`
- Timestamps are only set once (using `??` operator to prevent overwriting)
- All payment success handlers now set both `confirmed_at` and `payment_confirmed_at`
