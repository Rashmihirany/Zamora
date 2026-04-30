'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <div className="checkout-success">
        <div className="checkout-success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Order Confirmed!</h1>
        <p className="checkout-success-msg">
          Thank you for your purchase. Your order has been placed successfully.
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
