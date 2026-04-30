'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function CartSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isCartOpen, closeAll, cart, removeFromCart, cartTotal } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    if (!session) {
      alert('Please login to checkout');
      closeAll();
      router.push('/auth/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    closeAll();
    router.push('/checkout');
  };

  return (
    <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>YOUR BAG</h3>
        <button className="icon-btn" onClick={closeAll}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="cart-items">
        {!mounted || cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Your bag is empty
          </p>
        ) : (
          cart.map((item, index) => (
            <div
              key={`${item.id}-${item.size}-${index}`}
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '15px',
                borderBottom: '1px solid #f5f5f5',
                paddingBottom: '10px',
              }}
            >
              <div style={{ position: 'relative', width: '60px', height: '80px' }}>
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{item.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>
                  {item.size} | Rs {item.price.toFixed(2)} x {item.qty}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                style={{ fontSize: '1.2rem', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <div className="total-row">
          <span>Total</span>
          <span>Rs {mounted ? cartTotal().toFixed(2) : '0.00'}</span>
        </div>
        <button className="btn btn-primary full-width" onClick={handleCheckout}>
          CHECKOUT
        </button>
      </div>
    </div>
  );
}
