'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import './CardDetailsForm.css';

export interface CardFormRef {
  validate: () => boolean;
  getDetails: () => {
    cardDetails: {
      cardNumber: string;
      cardName: string;
      expiryDate: string;
      cvv: string;
    };
    cardType: 'credit' | 'debit';
  };
}

interface CardDetailsFormProps {
  total: number;
  cardType: 'credit' | 'debit';
  onCardTypeChange?: (cardType: 'credit' | 'debit') => void;
}

const CardDetailsForm = forwardRef<CardFormRef, CardDetailsFormProps>(({ total, cardType: initialCardType }, ref) => {
  const [cardType, setCardType] = useState<'credit' | 'debit'>(initialCardType);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNum || cardNum.length < 13 || cardNum.length > 19) {
      newErrors.cardNumber = 'Card number must be 13-19 digits';
    }

    if (!cardDetails.cardName || cardDetails.cardName.trim().length < 3) {
      newErrors.cardName = 'Cardholder name must be at least 3 characters';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = cardDetails.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(year);
      if (expYear < currentYear || (expYear === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '').slice(0, 19);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardDetails({ ...cardDetails, expiryDate: value });
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  useImperativeHandle(ref, () => ({
    validate: () => validateForm(),
    getDetails: () => ({ cardDetails, cardType })
  }));

  return (
    <div className="card-details-form">
      <div className="card-type-selector">
        <label className="card-type-option">
          <input
            type="radio"
            name="cardType"
            value="credit"
            checked={cardType === 'credit'}
            onChange={(e) => { setCardType(e.target.value as 'credit' | 'debit'); }}
          />
          <span className="card-type-label">
            <i className="fas fa-credit-card"></i> Credit Card
          </span>
        </label>
        <label className="card-type-option">
          <input
            type="radio"
            name="cardType"
            value="debit"
            checked={cardType === 'debit'}
            onChange={(e) => { setCardType(e.target.value as 'credit' | 'debit'); }}
          />
          <span className="card-type-label">
            <i className="fas fa-university"></i> Debit Card
          </span>
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">Card Number</label>
        <input
          type="text"
          className={`form-input ${errors.cardNumber ? 'error' : ''}`}
          placeholder="1234 5678 9012 3456"
          value={cardDetails.cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
          required
        />
        {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Cardholder Name</label>
        <input
          type="text"
          className={`form-input ${errors.cardName ? 'error' : ''}`}
          placeholder="John Doe"
          value={cardDetails.cardName}
          onChange={(e) => { setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() }); }}
          required
        />
        {errors.cardName && <span className="form-error">{errors.cardName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Expiry Date</label>
          <input
            type="text"
            className={`form-input ${errors.expiryDate ? 'error' : ''}`}
            placeholder="MM/YY"
            value={cardDetails.expiryDate}
            onChange={handleExpiryChange}
            maxLength={5}
            required
          />
          {errors.expiryDate && <span className="form-error">{errors.expiryDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">CVV</label>
          <input
            type="password"
            className={`form-input ${errors.cvv ? 'error' : ''}`}
            placeholder="123"
            value={cardDetails.cvv}
            onChange={handleCVVChange}
            maxLength={4}
            required
          />
          {errors.cvv && <span className="form-error">{errors.cvv}</span>}
        </div>
      </div>

      <div className="payment-summary">
        <div className="payment-summary-row">
          <span>Total Amount:</span>
          <span className="payment-amount">Rs {total.toFixed(2)}</span>
        </div>
      </div>

      <p className="payment-security-note">
        <i className="fas fa-lock"></i> Your payment information is encrypted and secure
      </p>
    </div>
  );
});

export default CardDetailsForm;
