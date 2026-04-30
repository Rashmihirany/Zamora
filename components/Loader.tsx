'use client';

import { useState, useEffect } from 'react';

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loader" style={{ opacity: isVisible ? 1 : 0 }}>
      <div className="loader-logo">ZAMORA</div>
    </div>
  );
}
