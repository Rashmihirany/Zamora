'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const recipient = searchParams.get('recipient');

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
        {orderId && (
          <p className="checkout-success-id">
            Order ID: <strong>{orderId}</strong>
          </p>
        )}
        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" className="btn btn-primary">
            CONTINUE SHOPPING
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
