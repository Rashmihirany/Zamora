'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  inStock?: boolean;
}

export default function ProductCard({ id, name, price, imageUrl, inStock = true }: ProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement | HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cardContent = (
    <>
      <div className="product-image">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
        {!inStock && (
          <div className="out-of-stock-badge">
            <span>OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p>Rs {price.toFixed(2)}</p>
      </div>
    </>
  );

  // If out of stock, render as div instead of Link to prevent navigation
  if (!inStock) {
    return (
      <div ref={cardRef as React.RefObject<HTMLDivElement>} className="product-card reveal-on-scroll out-of-stock">
        {cardContent}
      </div>
    );
  }

  return (
    <Link ref={cardRef as React.RefObject<HTMLAnchorElement>} href={`/products/${id}`} className="product-card reveal-on-scroll">
      {cardContent}
    </Link>
  );
}
