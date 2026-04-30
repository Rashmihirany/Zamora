'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import ReviewSection from '@/components/ReviewSection';

interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  colorImages?: { color: string; imageUrl: string }[];
  inStock: boolean;
}

interface Review {
  _id: string;
  username: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt?: string;
}

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
}

export default function ProductDetail({ product, reviews: initialReviews }: ProductDetailProps) {
  const { data: session } = useSession();
  const { addToCart, toggleCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = product.size ? product.size.split(',') : ['One Size'];
  const colors = product.color ? product.color.split(',').map((c) => c.trim()) : [];
  const colorImages = product.colorImages || [];

  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '');
  const [displayImage, setDisplayImage] = useState<string>(product.imageUrl);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const match = colorImages.find((ci) => ci.color === color);
    if (match) {
      setDisplayImage(match.imageUrl);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      img: displayImage,
      size: selectedSize || sizes[0],
    });
    toggleCart(true);
  };

  return (
    <section className="view active">
      <div className="product-detail-layout">
        <div className="detail-image">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-price">Rs {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>

          <div className="detail-meta">
            {/* Color Swatches */}
            {colors.length > 0 && (
              <div className="detail-color-section">
                <h4 className="detail-section-label">
                  Colour : <span className="detail-selected-color">{selectedColor}</span>
                </h4>
                <div className="detail-color-swatches">
                  {colorImages.length > 0 ? (
                    colorImages.map((ci) => (
                      <button
                        key={ci.color}
                        className={`detail-color-swatch-img ${selectedColor === ci.color ? 'active' : ''}`}
                        onClick={() => handleColorSelect(ci.color)}
                        title={ci.color}
                      >
                        <Image src={ci.imageUrl} alt={ci.color} fill style={{ objectFit: 'cover' }} />
                        {selectedColor === ci.color && (
                          <span className="detail-color-check">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    colors.map((color) => (
                      <button
                        key={color}
                        className={`detail-color-btn ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        {color}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <h4 className="detail-section-label">SELECT SIZE</h4>
            <div className="detail-size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-secondary'} size-btn`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary full-width"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={!product.inStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {product.inStock ? 'Add to cart' : 'OUT OF STOCK'}
            </button>
            {product.inStock ? (
              <Link
                href={`/gift?productId=${product._id}&name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(displayImage)}&sizes=${encodeURIComponent(product.size)}`}
                className="btn btn-secondary full-width gift-btn"
              >
                <i className="fas fa-gift"></i> SEND AS A GIFT
              </Link>
            ) : (
              <button
                className="btn btn-secondary full-width gift-btn"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <i className="fas fa-gift"></i> SEND AS A GIFT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={product._id} initialReviews={initialReviews} />
    </section>
  );
}
