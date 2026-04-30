'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !recipientPhone || !shippingAddress) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/gift-orders', {
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
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/gift/success?orderId=${data.order._id}&recipient=${encodeURIComponent(recipientName)}`);
      } else {
        alert(data.error || 'Failed to place gift order');
      }
    } catch {
      alert('Error placing gift order');
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
