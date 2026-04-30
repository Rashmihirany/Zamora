'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  dateAdded: string;
  inStock: boolean;
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch('/api/products/new-arrivals');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div className="new-arrivals-hero">
        <div className="new-arrivals-hero-bg"></div>
        <div className="new-arrivals-hero-overlay"></div>
        <div className="new-arrivals-hero-content">
          <span className="new-arrivals-eyebrow">
            <i className="fas fa-star"></i> JUST DROPPED
          </span>
          <h1 className="new-arrivals-title">New Arrivals</h1>
          <p className="new-arrivals-subtitle">
            Fresh additions for {currentMonth} — discover the latest pieces in our collection.
          </p>
        </div>
      </div>

      {/* Products Count */}
      <div className="new-arrivals-bar">
        <div className="new-arrivals-count">
          <i className="fas fa-fire" style={{ color: 'var(--accent-color)', marginRight: '8px' }}></i>
          {loading ? '...' : `${products.length} new ${products.length === 1 ? 'item' : 'items'} this month`}
        </div>
        <Link href="/products" className="new-arrivals-all-link">
          View All Products <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="new-arrivals-loading">
          <div className="loader"></div>
          <p>Loading new arrivals...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="new-arrivals-grid">
          {products.map((product) => (
            <div key={product._id} className="new-arrivals-card-wrap">
              <div className="new-arrivals-badge">NEW</div>
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                inStock={product.inStock}
              />
              <div className="new-arrivals-card-meta">
                <span className="new-arrivals-category">{product.category}</span>
                <span className="new-arrivals-date">
                  {new Date(product.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="new-arrivals-empty">
          <i className="fas fa-box-open"></i>
          <h3>No new arrivals yet</h3>
          <p>Check back soon — fresh pieces are added regularly!</p>
          <Link href="/products" className="btn btn-primary">
            BROWSE ALL PRODUCTS
          </Link>
        </div>
      )}
    </div>
  );
}
