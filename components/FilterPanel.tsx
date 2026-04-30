'use client';

import { useStore } from '@/store/useStore';

export default function FilterPanel() {
  const { isFilterPanelOpen, closeAll, filters, setFilter, resetFilters } = useStore();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('sort', e.target.value);
  };

  const handleStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('inStock', e.target.checked);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('priceMax', parseInt(e.target.value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || null;
    setFilter('category', value);
    // Reset sub-category when category changes
    setFilter('subCategory', null);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || null;
    setFilter('subCategory', value);
  };

  const hasActiveFilters =
    filters.category !== null ||
    filters.subCategory !== null ||
    filters.sort !== 'newest' ||
    filters.priceMax < 15000 ||
    filters.inStock !== false;

  return (
    <div className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <h3>REFINE</h3>
        <button className="icon-btn close-btn" onClick={closeAll} title="Close filters">
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="panel-body">
        {/* Category */}
        <div className="filter-group">
          <label>Category</label>
          <div className="select-wrapper">
            <select
              value={filters.category || ''}
              onChange={handleCategoryChange}
              title="Select category"
            >
              <option value="">All Categories</option>
              <option value="Dresses">Dresses</option>
              <option value="Tops">Tops</option>
              <option value="Trousers">Trousers</option>
              <option value="Denim">Denim</option>
              <option value="Skirts">Skirts</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>

        {/* Sub-Category */}
        <div className="filter-group">
          <label>Style</label>
          <div className="select-wrapper">
            <select
              value={filters.subCategory || ''}
              onChange={handleSubCategoryChange}
              title="Select style"
            >
              <option value="">All Styles</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
              <option value="office">Office</option>
              <option value="casual">Casual</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label>Sort By</label>
          <div className="select-wrapper">
            <select
              value={filters.sort}
              onChange={handleSortChange}
              title="Sort products"
            >
              <option value="newest">New Arrivals</option>
              <option value="oldest">Date: Old to New</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>

        {/* In Stock Toggle */}
        <div className="filter-group flex-between toggle-group">
          <label>In Stock Only</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={handleStockToggle}
              title="Toggle in stock only"
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label>Price Limit</label>
          <div className="price-slider-container">
            <input
              type="range"
              min="500"
              max="15000"
              value={filters.priceMax}
              onChange={handlePriceChange}
              className="styled-range"
              title="Set maximum price"
            />
            <div className="price-display">
              <span>Rs 500</span>
              <span>Rs {filters.priceMax}</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary full-width" onClick={closeAll}>
          SHOW RESULTS
        </button>

        {hasActiveFilters && (
          <button
            className="filter-clear-btn"
            onClick={() => {
              resetFilters();
              closeAll();
            }}
          >
            CLEAR ALL FILTERS
          </button>
        )}
      </div>
    </div>
  );
}
