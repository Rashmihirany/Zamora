'use client';

import { useState, forwardRef } from 'react';
import CardDetailsForm, { CardFormRef } from './CardDetailsForm';
import './PaymentMethods.css';

interface PaymentMethodsProps {
  total: number;
  onPaymentMethodSelect: (method: {
    type: 'cod' | 'card' | 'stripe';
    cardType?: 'credit' | 'debit';
    cardDetails?: {
      cardNumber: string;
      cardName: string;
      expiryDate: string;
      cvv: string;
    };
    transactionId?: string;
  }) => void;
}

const PaymentMethods = forwardRef<CardFormRef, PaymentMethodsProps>(({ total, onPaymentMethodSelect }, ref) => {
  const [selectedMethod, setSelectedMethod] = useState<'cod' | 'card' | 'stripe' | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);

  const handleMethodSelect = (method: 'cod' | 'card' | 'stripe') => {
    setSelectedMethod(method);
    if (method === 'cod' || method === 'stripe') {
      setShowCardForm(false);
      onPaymentMethodSelect({ type: method });
    } else if (method === 'card') {
      setShowCardForm(true);
      onPaymentMethodSelect({ type: 'card' });
    }
  };

  return (
    <div className="payment-methods-container">
      <div className="payment-methods-wrapper">
        {/* COD Option */}
        <div
          className={`payment-method-card ${selectedMethod === 'cod' ? 'active' : ''}`}
          onClick={() => handleMethodSelect('cod')}
        >
          <div className="payment-method-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="payment-method-content">
            <h3 className="payment-method-title">Cash on Delivery</h3>
            <p className="payment-method-desc">Pay when you receive your order</p>
            <div className="payment-method-fee">No additional charges</div>
          </div>
          <div className={`payment-method-radio ${selectedMethod === 'cod' ? 'checked' : ''}`} />
        </div>

        {/* Card Payments Option */}
        <div
          className={`payment-method-card ${selectedMethod === 'card' ? 'active' : ''}`}
          onClick={() => handleMethodSelect('card')}
        >
          <div className="payment-method-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <div className="payment-method-content">
            <h3 className="payment-method-title">Card Payments</h3>
            <p className="payment-method-desc">Credit or Debit Card</p>
            <div className="payment-method-fee">Secure & instant</div>
          </div>
          <div className={`payment-method-radio ${selectedMethod === 'card' ? 'checked' : ''}`} />
        </div>

        {/* Stripe Option */}
        <div
          className={`payment-method-card ${selectedMethod === 'stripe' ? 'active' : ''}`}
          onClick={() => handleMethodSelect('stripe')}
        >
          <div className="payment-method-icon">
            <i className="fas fa-lock"></i>
          </div>
          <div className="payment-method-content">
            <h3 className="payment-method-title">Stripe Payment</h3>
            <p className="payment-method-desc">Secure payment gateway</p>
            <div className="payment-method-fee">Multiple payment options</div>
          </div>
          <div className={`payment-method-radio ${selectedMethod === 'stripe' ? 'checked' : ''}`} />
        </div>
      </div>

      {/* Card Details Form - Shows when Card Payment is selected */}
      {showCardForm && (
        <div className="card-form-wrapper">
          <CardDetailsForm
            ref={ref}
            total={total}
            cardType={selectedMethod === 'card' ? 'credit' : 'debit'}
          />
        </div>
      )}
    </div>
  );
});

export default PaymentMethods;
