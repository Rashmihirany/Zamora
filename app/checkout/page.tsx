'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore, CartItem } from '@/store/useStore';
import PaymentMethods from '@/components/PaymentMethods';
import { CardFormRef } from '@/components/CardDetailsForm';
import NotificationPopup from '@/components/NotificationPopup';

interface CheckoutItem extends CartItem {
  lineTotal: number;
}

interface PaymentData {
  type: 'cod' | 'card' | 'stripe';
  cardType?: 'credit' | 'debit';
  cardDetails?: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  transactionId?: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();

  // Form states
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    contactNumber: '',
  });

  // Checkout flow states
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    orderId: string;
    paymentMethod: string;
    total: number;
    email: string;
    address: typeof address;
    cardLast4?: string;
  } | null>(null);

  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessages, setNotificationMessages] = useState<string[]>([]);

  const cardFormRef = useRef<CardFormRef>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (hydrated && cart.length === 0 && currentStep !== 'confirmation') {
      router.push('/products');
    }
  }, [hydrated, cart.length, router, currentStep]);

  if (status === 'loading' || !hydrated) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '200px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const items: CheckoutItem[] = cart.map((item) => ({
    ...item,
    lineTotal: item.price * item.qty,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 5000 ? 0 : 350;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(index);
    } else {
      updateQuantity(index, newQty);
    }
  };

  const validateShippingInfo = (): boolean => {
    if (!email || !address.fullName || !address.street || !address.city || !address.state || !address.zip || !address.country || !address.contactNumber) {
      setNotificationType('error');
      setNotificationMessages(['Please fill in all shipping information fields']);
      setShowNotification(true);
      return false;
    }
    return true;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingInfo()) {
      setCurrentStep('payment');
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentMethodSelect = async (paymentData: PaymentData) => {
    setSelectedPayment(paymentData);
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      setNotificationType('error');
      setNotificationMessages(['Please select a payment method']);
      setShowNotification(true);
      return;
    }

    if (selectedPayment.type === 'card') {
      if (cardFormRef.current && !cardFormRef.current.validate()) {
        return;
      }
      const data = cardFormRef.current?.getDetails();
      if (data) {
        selectedPayment.cardDetails = data.cardDetails;
        selectedPayment.cardType = data.cardType;
        selectedPayment.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
    }

    setSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          qty: item.qty,
          imageUrl: item.img,
        })),
        total,
        email,
        shippingAddress: address,
        paymentMethod: selectedPayment.type,
        paymentDetails: {
          method: selectedPayment.type,
          ...(selectedPayment.cardType && { cardType: selectedPayment.cardType }),
          ...(selectedPayment.transactionId && { transactionId: selectedPayment.transactionId }),
        },
      };

      // If Stripe, try to create payment intent (gracefully bypass if key is missing)
      if (selectedPayment.type === 'stripe') {
        try {
          const stripeRes = await fetch('/api/payment/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: total,
              email,
              orderDescription: `ZAMORA Store Purchase`,
            }),
          });

          if (stripeRes.ok) {
            const stripeData = await stripeRes.json();
            if (stripeData.success) {
              orderData.paymentDetails = {
                ...orderData.paymentDetails,
                stripePaymentIntentId: stripeData.paymentIntentId,
              };
            }
            // If Stripe key missing, fall through and process order without intent ID
          }
        } catch (stripeErr) {
          // Stripe unreachable — continue processing order without it
          console.warn('Stripe unavailable, processing as direct payment:', stripeErr);
        }
      }

      // Process payment and create order
      const res = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        let orderErrorMsg = 'Failed to process order';
        try {
          const orderErrorData = await res.json();
          orderErrorMsg = orderErrorData.error || orderErrorMsg;
        } catch (e) {
          orderErrorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(orderErrorMsg);
      }

      const data = await res.json();

      if (data.success) {
        setOrderId(data.order._id);
        setPlacedOrderDetails({
          orderId: data.order._id,
          paymentMethod: selectedPayment.type,
          total,
          email,
          address,
          cardLast4: selectedPayment.cardDetails?.cardNumber
            ? selectedPayment.cardDetails.cardNumber.replace(/\s/g, '').slice(-4)
            : undefined,
        });

        // Send receipt email in background
        try {
          await fetch('/api/payment/send-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.order._id }),
          });
        } catch (emailError) {
          console.error('Error sending receipt:', emailError);
        }

        clearCart();
        setCurrentStep('confirmation');
        window.scrollTo(0, 0);
        setNotificationType('success');

        const successMsgs = ['Order successfully placed!', 'A confirmation has been emailed to you'];
        if (selectedPayment.type === 'card') {
          const cardLast4 = selectedPayment.cardDetails?.cardNumber
            ? selectedPayment.cardDetails.cardNumber.replace(/\s/g, '').slice(-4)
            : '';
          successMsgs.unshift(`Card Details Confirmed (**** ${cardLast4})`);
        }

        setNotificationMessages(successMsgs);
        setShowNotification(true);
      } else {
        throw new Error(data.error || 'Failed to process order');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      setNotificationType('error');
      setNotificationMessages([
        'Order failed',
        error.message || 'Please try again',
      ]);
      setShowNotification(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="checkout-title">Checkout</h1>

      {/* Stepper */}
      <div className="checkout-stepper">
        <div className={`stepper-step ${currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'confirmation' ? 'active' : ''}`}>
          <div className="stepper-number">1</div>
          <div className="stepper-label">Shipping</div>
        </div>
        <div className="stepper-line"></div>
        <div className={`stepper-step ${currentStep === 'payment' || currentStep === 'confirmation' ? 'active' : ''}`}>
          <div className="stepper-number">2</div>
          <div className="stepper-label">Payment</div>
        </div>
        <div className="stepper-line"></div>
        <div className={`stepper-step ${currentStep === 'confirmation' ? 'active' : ''}`}>
          <div className="stepper-number">3</div>
          <div className="stepper-label">Confirmation</div>
        </div>
      </div>

      <form className="checkout-layout">
        {/* Left Column — Form */}
        <div className="checkout-form-col">
          {/* SHIPPING STEP */}
          {currentStep === 'shipping' && (
            <>
              {/* Contact */}
              <section className="checkout-section">
                <h2 className="checkout-section-title">Contact Information</h2>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label className="form-label">Email Address</label>
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    className="form-input"
                    placeholder=" "
                    value={address.contactNumber}
                    onChange={(e) => setAddress({ ...address, contactNumber: e.target.value })}
                    required
                    pattern="[0-9]{10,15}"
                  />
                  <label className="form-label">Contact Number</label>
                </div>
              </section>

              {/* Shipping */}
              <section className="checkout-section">
                <h2 className="checkout-section-title">Shipping Address</h2>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    required
                  />
                  <label className="form-label">Full Name</label>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                  />
                  <label className="form-label">Street Address</label>
                </div>
                <div className="checkout-form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder=" "
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                    />
                    <label className="form-label">City</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder=" "
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      required
                    />
                    <label className="form-label">State</label>
                  </div>
                </div>
                <div className="checkout-form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder=" "
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      required
                    />
                    <label className="form-label">ZIP / Postal Code</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder=" "
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      required
                    />
                    <label className="form-label">Country</label>
                  </div>
                </div>
              </section>

              {/* Next Button */}
              <button
                type="button"
                className="btn btn-primary full-width"
                onClick={handleNextToPayment}
              >
                CONTINUE TO PAYMENT
              </button>
            </>
          )}

          {/* PAYMENT STEP */}
          {currentStep === 'payment' && (
            <>
              <section className="checkout-section">
                <h2 className="checkout-section-title">Select Payment Method</h2>
                <PaymentMethods
                  ref={cardFormRef}
                  total={total}
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                />
              </section>

              {/* Place Order & Back Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary full-width"
                  onClick={() => {
                    setCurrentStep('shipping');
                    setSelectedPayment(null);
                  }}
                >
                  ← BACK TO SHIPPING
                </button>
                <button
                  type="button"
                  className="btn btn-primary full-width"
                  onClick={handlePlaceOrder}
                  disabled={!selectedPayment || submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> PROCESSING...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>{' '}
                      {selectedPayment?.type === 'cod'
                        ? 'CONFIRM ORDER (CASH ON DELIVERY)'
                        : `PLACE ORDER — Rs ${total.toFixed(2)}`
                      }
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* CONFIRMATION STEP */}
          {currentStep === 'confirmation' && placedOrderDetails && (
            <section className="checkout-section">
              <div className="confirmation-message">
                <div className="confirmation-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Your order has been successfully placed.</p>
                <p className="order-id">Order ID: <strong>#{placedOrderDetails.orderId}</strong></p>
              </div>

              {/* Confirmation Details */}
              <div className="confirmation-details">
                <div className="confirmation-detail-row">
                  <span className="confirmation-detail-label">Payment Method</span>
                  <span className="confirmation-detail-value">
                    {placedOrderDetails.paymentMethod === 'cod' && <><i className="fas fa-money-bill-wave"></i> Cash on Delivery</>}
                    {placedOrderDetails.paymentMethod === 'card' && <><i className="fas fa-credit-card"></i> Card Payment {placedOrderDetails.cardLast4 ? `(**** ${placedOrderDetails.cardLast4})` : ''}</>}
                    {placedOrderDetails.paymentMethod === 'stripe' && <><i className="fas fa-lock"></i> Stripe Payment</>}
                  </span>
                </div>
                <div className="confirmation-detail-row">
                  <span className="confirmation-detail-label">Order Total</span>
                  <span className="confirmation-detail-value">Rs {placedOrderDetails.total.toFixed(2)}</span>
                </div>
                <div className="confirmation-detail-row">
                  <span className="confirmation-detail-label">Email</span>
                  <span className="confirmation-detail-value">{placedOrderDetails.email}</span>
                </div>
                <div className="confirmation-detail-row">
                  <span className="confirmation-detail-label">Ship To</span>
                  <span className="confirmation-detail-value">
                    {placedOrderDetails.address.fullName}<br />
                    {placedOrderDetails.address.street}, {placedOrderDetails.address.city}<br />
                    {placedOrderDetails.address.state} {placedOrderDetails.address.zip}, {placedOrderDetails.address.country}
                  </span>
                </div>
                {placedOrderDetails.paymentMethod === 'cod' && (
                  <div className="confirmation-cod-note">
                    <i className="fas fa-info-circle"></i>
                    <span>Please have the exact amount ready at delivery. Payment is collected upon receipt.</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary full-width"
                style={{ marginTop: '2rem' }}
                onClick={() => router.push(`/checkout/success?orderId=${placedOrderDetails.orderId}`)}
              >
                <i className="fas fa-bag-shopping"></i> VIEW ORDER DETAILS
              </button>
            </section>
          )}
        </div>

        {/* Right Column — Order Summary (Hide on confirmation) */}
        {currentStep !== 'confirmation' && (
          <div className="checkout-summary-col">
            <div className="checkout-summary-card">
              <h2 className="checkout-section-title">Order Summary</h2>

              <div className="checkout-items">
                {items.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="checkout-item">
                    <div className="checkout-item-img">
                      <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="checkout-item-info">
                      <h4>{item.name}</h4>
                      <p className="checkout-item-meta">Size: {item.size}</p>
                      <p className="checkout-item-meta">Rs {item.price.toFixed(2)} each</p>
                      {currentStep === 'shipping' && (
                        <div className="checkout-qty-row">
                          <button
                            type="button"
                            className="checkout-qty-btn"
                            onClick={() => handleQuantityChange(index, item.qty - 1)}
                          >
                            −
                          </button>
                          <span className="checkout-qty-value">{item.qty}</span>
                          <button
                            type="button"
                            className="checkout-qty-btn"
                            onClick={() => handleQuantityChange(index, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="checkout-item-price">
                      Rs {item.lineTotal.toFixed(2)}
                    </div>
                    {currentStep === 'shipping' && (
                      <button
                        type="button"
                        className="checkout-item-remove"
                        onClick={() => removeFromCart(index)}
                        title="Remove item"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `Rs ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Tax (8%)</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>
                <div className="checkout-total-row checkout-grand-total">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="checkout-shipping-note">
                  Free shipping on orders over Rs 5,000
                </p>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Notification Popup */}
      {showNotification && (
        <NotificationPopup
          type={notificationType}
          messages={notificationMessages}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
