# Quick Start - Payment System

## TL;DR Setup (5 Minutes)

### 1. Install Dependencies ✅ (Already Done)
```bash
npm install stripe @stripe/react-stripe-js @stripe/stripe-js nodemailer
```

### 2. Create `.env.local` File
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890...
STRIPE_SECRET_KEY=sk_test_98765432...
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=app_password_from_google
EMAIL_FROM=noreply@zamora.com
NEXTAUTH_SECRET=your_existing_secret
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_existing_uri
```

### 3. Get Stripe Keys
1. Go to https://dashboard.stripe.com
2. Click "Developers" → "API Keys"
3. Copy Publishable and Secret keys
4. Paste into `.env.local`

### 4. Gmail Setup for Emails
1. Open https://myaccount.google.com/security
2. Enable 2-Step Verification (if not done)
3. Search for "App passwords"
4. Select Mail → Windows/Linux
5. Copy the 16-character password
6. Add to `.env.local` as `EMAIL_PASSWORD`

### 5. Start Server
```bash
npm run dev
```

✅ **Done!** Visit http://localhost:3000/checkout

## Test the Payment System

### Testing COD
1. Go to /checkout
2. Fill shipping info
3. Select "Cash on Delivery"
4. Click "Place Order"
5. ✅ Success!

### Testing Card Payment
1. Go to /checkout
2. Fill shipping info
3. Select "Card Payments"
4. Choose Credit or Debit
5. Enter test card:
   - **Number**: 4242 4242 4242 4242
   - **Expiry**: 12/34
   - **CVV**: 123
6. Click "Place Order"
7. ✅ Success!

### Testing Stripe
1. Go to /checkout
2. Fill shipping info
3. Select "Stripe Payment"
4. (Same test card as above)
5. ✅ Success!

## Check Admin Dashboard

1. Go to /admin
2. Click "Orders"
3. See your test order
4. New "Payment" column shows method & status
5. Click dropdown to expand order details
6. See masked card (••••••••••••4242)

## What You Get

✅ **Three Payment Methods**
- Cash on Delivery
- Card Payments (Credit/Debit)
- Stripe Integration

✅ **Automatic Features**
- Email receipts sent automatically
- Success popups on order
- Order confirmation page
- Admin tracking dashboard

✅ **Security**
- Card details never stored
- Only last 4 digits visible
- CVV never saved
- Stripe secure processing

✅ **Design**
- Follows ZAMORA luxury theme
- Smooth animations
- Responsive on all devices
- Professional styling

## If Something Doesn't Work

**Email not sending?**
- Check EMAIL_USER and EMAIL_PASSWORD in .env.local
- Verify Gmail has 2FA enabled
- Check app password (not regular password)

**Stripe error?**
- Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Check STRIPE_SECRET_KEY
- Make sure you're using test keys (start with pk_test_ and sk_test_)

**Payment won't process?**
- Check browser console (F12) for errors
- Verify all env variables are set
- Try with test card numbers above

**No order in admin?**
- Refresh page (F5)
- Check admin is logged in
- Check network tab for 500 errors

## Files You Need to Know

📁 **Main Checkout**: `app/checkout/page.tsx`
📁 **Admin Orders**: `app/admin/components/OrdersManager.tsx`
📁 **Database**: `models/Order.ts`
📁 **Payment Routes**: `app/api/payment/`
📁 **Docs**: `PAYMENT_SYSTEM_SETUP.md` (detailed guide)

## Production Checklist

Before going live:
- [ ] Change Stripe keys to LIVE (pk_live_ and sk_live_)
- [ ] Use production email credentials
- [ ] Test with real card (but use small amount)
- [ ] Set NEXTAUTH_URL to your domain
- [ ] Enable Stripe webhooks
- [ ] Test email delivery on real emails
- [ ] Review security settings

---

**Need More Help?** Check `PAYMENT_SYSTEM_SETUP.md` for detailed documentation.
