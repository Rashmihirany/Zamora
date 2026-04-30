# Payment System Implementation Guide - ZAMORA E-commerce

This guide walks you through setting up and using the new multi-method payment system.

## Features Implemented

### 1. **Multiple Payment Methods**
   - **Cash on Delivery (COD)**: Pay when you receive your order
   - **Card Payments**: Credit and Debit card payments
   - **Stripe Integration**: Secure payment gateway with multiple options

### 2. **Card Payment Support**
   - Credit Card support
   - Debit Card support
   - Real-time card validation
   - Secure card data handling (never stored in database)

### 3. **Order Management**
   - Multi-step checkout process (Shipping → Payment → Confirmation)
   - Real-time payment status tracking
   - Automatic email receipts with detailed invoice
   - Order confirmation popups

### 4. **Admin Dashboard**
   - Payment method visibility
   - Payment status management
   - Card details masking (only last 4 digits visible)
   - Payment status filters
   - No sensitive card information exposure

## Installation & Setup

### Step 1: Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Email Configuration (Using Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@zamora.com

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Step 2: Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API Keys
3. Copy your **Publishable Key** and **Secret Key**
4. Add them to your `.env.local` file

### Step 3: Gmail Configuration (for Email Receipts)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Create an **App Password** for your application
4. Add the email and app password to `.env.local`

### Step 4: Start Development Server

```bash
npm run dev
```

The payment system is now ready to use!

## User Flow

### Checkout Process

1. **Shipping Step**
   - Enter contact information
   - Enter shipping address
   - Click "Continue to Payment"

2. **Payment Step**
   - Select payment method:
     - Cash on Delivery
     - Card Payment (Credit/Debit)
     - Stripe Payment
   - If Card Payment selected:
     - Choose card type (Credit or Debit)
     - Enter card details
     - System validates in real-time
   - Click "Place Order"

3. **Confirmation Step**
   - Order confirmation message
   - Digital receipt emailed
   - Automatic redirect to order confirmation page

### Success Messages

Two popup notifications are shown:
- ✅ **"Order successfully placed!"**
- ✅ **"Your digital receipt has been emailed to you"**

## Database Schema

### Order Model Updates

```typescript
interface IOrder extends Document {
  paymentMethod: 'cod' | 'card' | 'stripe';
  paymentDetails?: {
    method: 'cod' | 'card' | 'stripe';
    cardType?: 'credit' | 'debit';      // Card type
    last4?: string;                      // Last 4 digits only
    transactionId?: string;              // Transaction reference
    stripePaymentIntentId?: string;      // Stripe payment intent
  };
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  receiptSent: boolean;
}
```

## Security Features

### ✅ Card Data Security
- ✓ Card details never stored in database
- ✓ Only last 4 digits stored for display
- ✓ CVV never stored
- ✓ Full card number only used for validation and processing
- ✓ Admin sees only masked card info (••••••••••••1234)

### ✅ Encryption
- ✓ All API routes require authentication
- ✓ Payment endpoints protected
- ✓ Email receipts sent through secure channels

### ✅ Stripe Security
- ✓ Payment Intent system
- ✓ 3D Secure ready
- ✓ PCI DSS compliant

## API Routes

### Payment Processing

**POST** `/api/payment/create-intent`
- Creates Stripe payment intent
- Required: amount, email, orderId (optional), orderDescription (optional)

**POST** `/api/payment/process`
- Processes payment and creates order
- Handles all payment methods
- Required: items, total, email, shippingAddress, paymentMethod, paymentDetails

**POST** `/api/payment/send-receipt`
- Sends email receipt
- Required: orderId
- Generates HTML invoice and sends via email

**PATCH** `/api/admin/orders/[id]`
- Updates order and payment status
- Admin only
- Can update: status, paymentStatus

## Admin Dashboard Features

### Payment Status Management
- View payment method used
- Update payment status (unpaid → paid → failed)
- Filter orders by payment status
- View masked card information

### Order Details
- See all payment information
- No sensitive data exposure
- Payment method clearly labeled
- Card type visible (if applicable)

## Email Receipt Template

Digital receipts include:
- Order confirmation with date
- Full itemized list
- Shipping address
- Payment method
- Total amount
- Professional branded template

## Testing

### Test Card Numbers (Stripe)

| Card Type | Number | CVC | Expiry |
|-----------|--------|-----|--------|
| Visa | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date |
| Amex | 3782 822463 10005 | Any 4 digits | Any future date |

### Test Modes
- **COD**: No payment required, mark as paid in admin
- **Card**: Use test card numbers above
- **Stripe**: Same test cards work in test mode

## Styling & Theme

All payment components follow the ZAMORA luxury theme:

- **Colors**: Champagne Gold (#C5A358), Beige (#F5F5DC), Soft Grey (#E5E5E5)
- **Animations**: Smooth luxury transitions with ease-out timing
- **Typography**: Playfair Display for headings, Inter for body
- **Glass Morphism**: Frosted glass effects on cards and modals

## Component Hierarchy

```
checkout/page.tsx
├── PaymentMethods.tsx
│   ├── CardDetailsForm.tsx
│   │   └── Form validation & submission
│   └── Payment method selection
├── NotificationPopup.tsx
│   └── Success/Error notifications
└── Order summary & address form
```

## File Structure

```
app/
├── api/
│   ├── payment/
│   │   ├── create-intent/route.ts
│   │   ├── process/route.ts
│   │   └── send-receipt/route.ts
│   └── admin/orders/[id]/route.ts (updated)
├── checkout/
│   └── page.tsx (updated)
└── globals.css (updated with payment styles)

components/
├── PaymentMethods.tsx (NEW)
├── PaymentMethods.css (NEW)
├── CardDetailsForm.tsx (NEW)
├── CardDetailsForm.css (NEW)
├── NotificationPopup.tsx (NEW)
├── NotificationPopup.css (NEW)
└── OrdersManager.tsx (updated)

models/
└── Order.ts (updated with payment fields)
```

## Troubleshooting

### Stripe Payments Not Working
- Check Stripe API keys in `.env.local`
- Ensure you're in test mode
- Check browser console for errors

### Email Receipts Not Sending
- Verify Gmail credentials in `.env.local`
- Check that 2FA is enabled and app password is correct
- Check email service logs

### Payment Status Not Updating
- Ensure admin is logged in
- Check that order exists
- Verify payment status is valid: 'unpaid', 'paid', 'failed'

### Card Validation Errors
- Card number must be 13-19 digits
- Expiry must be MM/YY format and not expired
- CVV must be 3-4 digits

## Future Enhancements

Potential improvements for future iterations:
- [ ] Payment webhook handling for Stripe
- [ ] Multiple currency support
- [ ] Installment payment plans
- [ ] Digital wallet integration (Apple Pay, Google Pay)
- [ ] Invoice PDF generation
- [ ] Payment retry mechanism
- [ ] Refund management system

## Support

For issues or questions regarding the payment system:
1. Check this guide thoroughly
2. Review console errors and network requests
3. Verify all environment variables are set correctly
4. Test with test card numbers in Stripe dashboard

---

**Last Updated**: April 2026  
**Version**: 1.0.0
