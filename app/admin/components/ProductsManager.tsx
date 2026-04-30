'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  colorImages: { color: string; imageUrl: string }[];
  inStock: boolean;
}

interface ColorImageEntry {
  color: string;
  file: File | null;
  preview: string;
  imageUrl: string;
}

interface ProductFormData {
  name: string;
  category: string;
  subCategory: string;
  price: string;
  size: string;
  inStock: boolean;
}

const emptyForm: ProductFormData = {
  name: '',
  category: 'Dresses',
  subCategory: 'formal',
  price: '',
  size: 'S,M,L',
  inStock: true,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [colorEntries, setColorEntries] = useState<ColorImageEntry[]>([{ color: '', file: null, preview: '', imageUrl: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch {
      console.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setColorEntries([{ color: '', file: null, preview: '', imageUrl: '' }]);
    setShowForm(true);
    setError('');
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: String(product.price),
      size: product.size,
      inStock: product.inStock,
    });
    // Populate color entries from existing colorImages
    if (product.colorImages && product.colorImages.length > 0) {
      setColorEntries(
        product.colorImages.map((ci) => ({
          color: ci.color,
          file: null,
          preview: ci.imageUrl,
          imageUrl: ci.imageUrl,
        }))
      );
    } else {
      // Fallback for old products with single color/image
      setColorEntries([{
        color: product.color || '',
        file: null,
        preview: product.imageUrl,
        imageUrl: product.imageUrl,
      }]);
    }
    setShowForm(true);
    setError('');
  };

  const addColorEntry = () => {
    setColorEntries([...colorEntries, { color: '', file: null, preview: '', imageUrl: '' }]);
  };

  const removeColorEntry = (index: number) => {
    if (colorEntries.length <= 1) return;
    setColorEntries(colorEntries.filter((_, i) => i !== index));
  };

  const updateColorName = (index: number, color: string) => {
    const updated = [...colorEntries];
    updated[index].color = color;
    setColorEntries(updated);
  };

  const handleColorImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...colorEntries];
      updated[index].file = file;
      updated[index].preview = reader.result as string;
      setColorEntries(updated);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validate all color entries have a color name
      const validEntries = colorEntries.filter((ce) => ce.color.trim());
      if (validEntries.length === 0) {
        throw new Error('Please add at least one color with a name');
      }

      // Upload images for entries that have new files
      setUploading(true);
      const uploadedColorImages: { color: string; imageUrl: string }[] = [];

      for (const entry of validEntries) {
        let imageUrl = entry.imageUrl;
        if (entry.file) {
          imageUrl = await uploadImage(entry.file);
        }
        if (!imageUrl) {
          throw new Error(`Please select an image for color "${entry.color}"`);
        }
        uploadedColorImages.push({ color: entry.color.trim(), imageUrl });
      }
      setUploading(false);

      // Build color string (comma-separated) and use first image as main imageUrl
      const colorString = uploadedColorImages.map((ci) => ci.color).join(',');
      const mainImageUrl = uploadedColorImages[0].imageUrl;

      const payload = {
        ...form,
        price: parseFloat(form.price),
        color: colorString,
        imageUrl: mainImageUrl,
        colorImages: uploadedColorImages,
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      setShowForm(false);
      setColorEntries([{ color: '', file: null, preview: '', imageUrl: '' }]);
      fetchProducts();
    } catch (err: any) {
      setUploading(false);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchProducts();
    } catch {
      alert('Error deleting product');
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock }),
      });
      fetchProducts();
    } catch {
      alert('Error updating stock');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div>
      <div className="admin-section-header">
        <h3>Products ({products.length})</h3>
        <div className="admin-section-actions">
          <div className="admin-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary admin-btn" onClick={openCreate}>
            <i className="fas fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && typeof document !== 'undefined' && createPortal(
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              {error && <div className="admin-error">{error}</div>}

              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Dresses</option>
                    <option>Tops</option>
                    <option>Trousers</option>
                    <option>Denim</option>
                    <option>Skirts</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Sub-Category</label>
                  <select
                    value={form.subCategory}
                    onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                  >
                    <option value="formal">Formal</option>
                    <option value="party">Party</option>
                    <option value="office">Office</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                <div className="admin-field full-width">
                  <label>Colors & Images</label>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                    Add one image per color. The first color&apos;s image is used as the main product image.
                  </p>
                  <div className="color-image-entries">
                    {colorEntries.map((entry, index) => (
                      <div key={index} className="color-image-entry">
                        <div className="color-image-entry-header">
                          <input
                            type="text"
                            className="color-name-input"
                            placeholder="Color name (e.g. Red)"
                            value={entry.color}
                            onChange={(e) => updateColorName(index, e.target.value)}
                            required
                          />
                          {colorEntries.length > 1 && (
                            <button
                              type="button"
                              className="admin-icon-btn danger"
                              onClick={() => removeColorEntry(index)}
                              title="Remove color"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                        <div className="color-image-upload">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleColorImageSelect(index, e)}
                            id={`color-image-${index}`}
                            className="admin-upload-input"
                          />
                          <label htmlFor={`color-image-${index}`} className="color-image-label">
                            {entry.preview ? (
                              <img src={entry.preview} alt={entry.color || 'Preview'} className="color-image-preview" />
                            ) : (
                              <div className="color-image-placeholder">
                                <i className="fas fa-image"></i>
                                <span>Upload</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-secondary admin-btn add-color-btn" onClick={addColorEntry}>
                    <i className="fas fa-plus"></i> Add Another Color
                  </button>
                </div>
                <div className="admin-field">
                  <label>Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="S,M,L,XL"
                    required
                  />
                </div>
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                />
                In Stock
              </label>

              <div className="admin-form-actions">
                <button type="button" className="btn btn-secondary admin-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary admin-btn" disabled={saving || uploading}>
                  {uploading ? 'Uploading Image...' : saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="admin-product-cell">
                    <img src={product.imageUrl} alt={product.name} className="admin-thumb" />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>Rs {product.price.toFixed(2)}</td>
                <td>
                  <span
                    className={`admin-badge ${product.inStock ? 'admin-badge-success' : 'admin-badge-danger'}`}
                    onClick={() => toggleStock(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.inStock ? 'In Stock' : 'Out'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-icon-btn" title="Edit" onClick={() => openEdit(product)}>
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="admin-icon-btn danger" title="Delete" onClick={() => handleDelete(product._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
