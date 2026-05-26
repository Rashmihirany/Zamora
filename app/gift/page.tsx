'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import NotificationPopup from '@/components/NotificationPopup';

function GiftOrderForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get('productId') || '';
  const productName = searchParams.get('name') || '';
  const productPrice = parseFloat(searchParams.get('price') || '0');
  const productImage = searchParams.get('image') || '';
  const productSizes = (searchParams.get('sizes') || 'One Size').split(',');

  const [selectedSize, setSelectedSize] = useState(productSizes[0]);
  const [qty, setQty] = useState(1);

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Card payment states
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');

  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessages, setNotificationMessages] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user) {
      setSenderName(session.user.username || '');
      setSenderEmail(session.user.email || '');
    }
  }, [session]);

  const subtotal = productPrice * qty;
  const shipping = subtotal > 5000 ? 0 : 350;
  const giftWrap = 150;
  const total = subtotal + shipping + giftWrap;

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const validateCardForm = (): boolean => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setNotificationType('error');
      setNotificationMessages(['Please fill in all card details']);
      setShowNotification(true);
      return false;
    }
    const cleanCardNum = cardNumber.replace(/\s/g, '');
    if (cleanCardNum.length < 13 || cleanCardNum.length > 19) {
      setNotificationType('error');
      setNotificationMessages(['Invalid card number']);
      setShowNotification(true);
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setNotificationType('error');
      setNotificationMessages(['Invalid CVV']);
      setShowNotification(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !recipientPhone || !shippingAddress) {
      setNotificationType('error');
      setNotificationMessages(['Please fill in all required fields']);
      setShowNotification(true);
      return;
    }

    if (!showCardForm) {
      setNotificationType('error');
      setNotificationMessages(['Please add card payment details']);
      setShowNotification(true);
      setShowCardForm(true);
      return;
    }

    if (!validateCardForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/gift-orders/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            productId,
            name: productName,
            price: productPrice,
            imageUrl: productImage,
            size: selectedSize,
            qty,
          },
          senderName,
          senderEmail,
          recipientName,
          recipientPhone,
          giftMessage,
          shippingAddress,
          total,
          paymentMethod: 'card',
          paymentDetails: {
            cardType,
            cardNumber: cardNumber.replace(/\s/g, ''),
            cardName,
            expiryDate,
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setNotificationType('success');
        setNotificationMessages(['Payment successful!', 'Gift order placed successfully!']);
        setShowNotification(true);
        
        // Clear form
        setCardNumber('');
        setCardName('');
        setExpiryDate('');
        setCvv('');
        
        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/gift/success?orderId=${data.order._id}&recipient=${encodeURIComponent(recipientName)}&payment=true`);
        }, 2000);
      } else {
        setNotificationType('error');
        setNotificationMessages([data.error || 'Failed to place gift order']);
        setShowNotification(true);
      }
    } catch (error: any) {
      setNotificationType('error');
      setNotificationMessages(['Error placing gift order', error.message || 'Please try again']);
      setShowNotification(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
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

  if (!productId) {
    router.push('/products');
    return null;
  }

  return (
    <div className="page-container">
      <h1 className="checkout-title">
        <i className="fas fa-gift" style={{ color: 'var(--accent-color)', marginRight: '12px' }}></i>
        Send a Gift
      </h1>

      <form onSubmit={handleSubmit} className="checkout-layout">
        {/* Left Column — Form */}
        <div className="checkout-form-col">
          {/* Gift Product Preview */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Gift Item</h2>
            <div className="gift-product-preview">
              <div className="gift-product-img">
                {productImage && (
                  <Image src={productImage} alt={productName} fill style={{ objectFit: 'cover' }} />
                )}
              </div>
              <div className="gift-product-info">
                <h3>{productName}</h3>
                <p className="gift-product-price">Rs {productPrice.toFixed(2)}</p>
                <div className="gift-size-row">
                  <span className="gift-label">Size:</span>
                  <div className="gift-size-options">
                    {productSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`gift-size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size.trim()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="gift-qty-row">
                  <span className="gift-label">Qty:</span>
                  <div className="checkout-qty-row">
                    <button type="button" className="checkout-qty-btn" onClick={() => handleQtyChange(-1)}>−</button>
                    <span className="checkout-qty-value">{qty}</span>
                    <button type="button" className="checkout-qty-btn" onClick={() => handleQtyChange(1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sender Info */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">From (Your Details)</h2>
            <div className="checkout-form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder=" "
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
                <label className="form-label">Your Name</label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder=" "
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                />
                <label className="form-label">Your Email</label>
              </div>
            </div>
          </section>

          {/* Recipient Info */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">To (Recipient Details)</h2>
            <div className="checkout-form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder=" "
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
                <label className="form-label">Recipient Name</label>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  className="form-input"
                  placeholder=" "
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  required
                />
                <label className="form-label">Recipient Phone Number</label>
              </div>
            </div>
            <div className="form-group">
              <textarea
                className="form-input gift-message-input"
                placeholder=" "
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                rows={3}
              />
              <label className="form-label">Gift Message (optional)</label>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Shipping Address</h2>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder=" "
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
              <label className="form-label">Full Address</label>
            </div>
          </section>
        </div>

        {/* Right Column — Order Summary */}
        <div className="checkout-summary-col">
          <div className="checkout-summary-card">
            <h2 className="checkout-section-title">
              <i className="fas fa-gift" style={{ marginRight: '8px', color: 'var(--accent-color)' }}></i>
              Gift Order Summary
            </h2>

            <div className="gift-summary-item">
              <div className="gift-summary-img">
                {productImage && (
                  <Image src={productImage} alt={productName} fill style={{ objectFit: 'cover' }} />
                )}
              </div>
              <div className="gift-summary-info">
                <h4>{productName}</h4>
                <p>Size: {selectedSize} | Qty: {qty}</p>
              </div>
              <div className="checkout-item-price">
                Rs {subtotal.toFixed(2)}
              </div>
            </div>

            {recipientName && (
              <div className="gift-recipient-preview">
                <i className="fas fa-envelope"></i>
                <span>To: {recipientName}</span>
              </div>
            )}

            {giftMessage && (
              <div className="gift-message-preview">
                <i className="fas fa-quote-left"></i>
                <p>{giftMessage}</p>
              </div>
            )}

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
                <span><i className="fas fa-gift"></i> Gift Wrapping</span>
                <span>Rs {giftWrap.toFixed(2)}</span>
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

            {/* Card Payment Section */}
            {!showCardForm ? (
              <button
                type="button"
                className="btn btn-secondary full-width"
                style={{ marginBottom: '12px' }}
                onClick={() => setShowCardForm(true)}
              >
                <i className="fas fa-credit-card"></i> ADD CARD PAYMENT
              </button>
            ) : (
              <div className="checkout-section" style={{ marginBottom: '16px' }}>
                <h3 className="checkout-section-title">Card Payment Details</h3>
                
                <div className="form-group">
                  <label style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        value="credit"
                        checked={cardType === 'credit'}
                        onChange={(e) => setCardType(e.target.value as 'credit' | 'debit')}
                      />
                      Credit Card
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="radio"
                        value="debit"
                        checked={cardType === 'debit'}
                        onChange={(e) => setCardType(e.target.value as 'credit' | 'debit')}
                      />
                      Debit Card
                    </label>
                  </label>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    value={cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\s/g, '');
                      if (/^\d*$/.test(val)) {
                        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardNumber(formatted);
                      }
                    }}
                    maxLength={19}
                    required
                  />
                  <label className="form-label">Card Number</label>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder=" "
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                  <label className="form-label">Cardholder Name</label>
                </div>

                <div className="checkout-form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder=" "
                      value={expiryDate}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) {
                          val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        }
                        setExpiryDate(val);
                      }}
                      maxLength={5}
                      required
                    />
                    <label className="form-label">Expiry (MM/YY)</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder=" "
                      value={cvv}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setCvv(val);
                      }}
                      maxLength={4}
                      required
                    />
                    <label className="form-label">CVV</label>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setShowCardForm(false);
                    setCardNumber('');
                    setCardName('');
                    setExpiryDate('');
                    setCvv('');
                  }}
                >
                  Remove Card
                </button>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary full-width gift-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'PLACING GIFT ORDER...' : (
                <>
                  <i className="fas fa-gift"></i> SEND GIFT — Rs {total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Notification Popup */}
      <NotificationPopup
        type={notificationType}
        messages={notificationMessages}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default function GiftPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ textAlign: 'center', paddingTop: '200px' }}>Loading...</div>}>
      <GiftOrderForm />
    </Suspense>
  );
}
