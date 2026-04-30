'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  subCategory: string;
  inStock: boolean;
}

interface ProductsContentProps {
  initialProducts: Product[];
  category?: string;
}

export default function ProductsContent({ initialProducts, category }: ProductsContentProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toggleFilterPanel, filters } = useStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Refetch products when filters change
    const fetchProducts = async () => {
      const params = new URLSearchParams();

      // Category: use filter panel category if set, otherwise URL category
      const activeCategory = filters.category || category;
      if (activeCategory) params.append('category', activeCategory);

      // Sub-category
      if (filters.subCategory) params.append('sub_category', filters.subCategory);

      // Sort
      if (filters.sort && filters.sort !== 'newest') params.append('sort', filters.sort);

      // Price max (only send if less than max default 15000)
      if (filters.priceMax < 15000) params.append('price_max', filters.priceMax.toString());

      // In stock
      if (filters.inStock) params.append('in_stock', 'true');

      try {
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [filters, category]);

  return (
    <section className="view active">
      <div className="catalog-header">
        <h2>Collection</h2>
        <div className="catalog-controls">
          <span>
            {products.length === 0
              ? 'No items found'
              : filters.category || category
                ? `${products.length} ${filters.category || category} items`
                : `Showing ${products.length} items`}
          </span>
          <button className="filter-btn" onClick={toggleFilterPanel}>
            FILTERS <i className="fas fa-sliders-h"></i>
          </button>
        </div>
      </div>
      <div className="catalog-layout-full">
        {products.length === 0 ? (
          <div className="products-empty-state">
            <i className="fas fa-search"></i>
            <h3>No products match your filters</h3>
            <p>Try adjusting your filters or browse our full collection</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                inStock={product.inStock}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
