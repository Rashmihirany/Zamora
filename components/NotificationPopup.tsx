'use client';

import { useEffect, useState } from 'react';
import './NotificationPopup.css';

interface NotificationPopupProps {
  type: 'success' | 'error' | 'warning' | 'info';
  messages: string[];
  onClose?: () => void;
  duration?: number;
}

export default function NotificationPopup({
  type,
  messages,
  onClose,
  duration = 5000,
}: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: 'fa-check-circle',
      bgColor: '#10b981',
      borderColor: '#059669',
    },
    error: {
      icon: 'fa-times-circle',
      bgColor: '#ef4444',
      borderColor: '#dc2626',
    },
    warning: {
      icon: 'fa-exclamation-circle',
      bgColor: '#f59e0b',
      borderColor: '#d97706',
    },
    info: {
      icon: 'fa-info-circle',
      bgColor: '#3b82f6',
      borderColor: '#1d4ed8',
    },
  };

  const config = typeConfig[type];

  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup" style={{ borderTopColor: config.borderColor }}>
        <div className="notification-icon" style={{ color: config.bgColor }}>
          <i className={`fas ${config.icon}`}></i>
        </div>

        <div className="notification-content">
          {messages.map((message, index) => (
            <p key={index} className="notification-message">
              {message}
            </p>
          ))}
        </div>

        <button
          className="notification-close"
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
        >
          <i className="fas fa-times"></i>
        </button>

        {duration > 0 && (
          <div
            className="notification-progress"
            style={{
              backgroundColor: config.bgColor,
              animation: `progress ${duration}ms linear forwards`,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
