'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const recipient = searchParams.get('recipient');
  const paymentSuccess = searchParams.get('payment') === 'true';

  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <div className="checkout-success">
        <div className="checkout-success-icon" style={{ color: 'var(--accent-color)' }}>
          <i className="fas fa-gift"></i>
        </div>
        <h1>Gift Order Confirmed!</h1>
        <p className="checkout-success-msg">
          Your gift{recipient ? ` for ${recipient}` : ''} has been placed successfully.
          {recipient && ` ${recipient} is going to love it!`}
        </p>
        
        {paymentSuccess && (
          <div style={{ 
            background: '#e8f5e9', 
            border: '2px solid #4caf50', 
            borderRadius: '8px', 
            padding: '16px', 
            margin: '20px 0',
            textAlign: 'left'
          }}>
            <p style={{ color: '#2e7d32', margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '16px' }}>
              ✓ Payment Successful
            </p>
            <p style={{ color: '#2e7d32', margin: '8px 0', fontSize: '14px' }}>
              Your card has been charged and the payment is confirmed.
            </p>
            <p style={{ color: '#2e7d32', margin: '8px 0', fontSize: '14px' }}>
              A confirmation email has been sent to you with all order details.
            </p>
          </div>
        )}
        
        {orderId && (
          <p className="checkout-success-id">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}
        
        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" className="btn btn-primary">
            CONTINUE SHOPPING
          </Link>
          <Link href="/gift" className="btn btn-secondary">
            SEND ANOTHER GIFT
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GiftSuccessPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
