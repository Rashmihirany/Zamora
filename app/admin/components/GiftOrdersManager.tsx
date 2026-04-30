'use client';

import { useState, useEffect } from 'react';

interface GiftOrder {
  _id: string;
  userId: string;
  product: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    size: string;
    qty: number;
  };
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientPhone: string;
  giftMessage: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'admin-badge-warning',
  processing: 'admin-badge-info',
  shipped: 'admin-badge-primary',
  delivered: 'admin-badge-success',
  cancelled: 'admin-badge-danger',
};

export default function GiftOrdersManager() {
  const [orders, setOrders] = useState<GiftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGiftOrders();
  }, []);

  const fetchGiftOrders = async () => {
    try {
      const res = await fetch('/api/admin/gift-orders');
      const data = await res.json();
      setOrders(data);
    } catch {
      console.error('Error fetching gift orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/gift-orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchGiftOrders();
    } catch {
      alert('Error updating gift order status');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this gift order permanently?')) return;
    try {
      const res = await fetch(`/api/admin/gift-orders/${orderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      fetchGiftOrders();
    } catch {
      alert('Error deleting gift order');
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.senderName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="admin-loading">Loading gift orders...</div>;

  return (
    <div>
      <div className="admin-section-header">
        <h3><i className="fas fa-gift" style={{ color: 'var(--accent-color)', marginRight: '8px' }}></i>Gift Orders ({orders.length})</h3>
        <div className="admin-section-actions">
          <div className="admin-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search gift orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="admin-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Product</th>
              <th>From → To</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <>
                <tr key={order._id}>
                  <td>
                    <button
                      className="admin-link"
                      onClick={() =>
                        setExpandedId(expandedId === order._id ? null : order._id)
                      }
                    >
                      #{order._id.slice(-8)}
                    </button>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-product-cell">
                      <img src={order.product.imageUrl} alt={order.product.name} className="admin-thumb-sm" />
                      <span>{order.product.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="gift-admin-parties">
                      <span className="gift-admin-sender">{order.senderName}</span>
                      <i className="fas fa-arrow-right gift-admin-arrow"></i>
                      <span className="gift-admin-recipient">{order.recipientName}</span>
                    </div>
                  </td>
                  <td>Rs {order.totalAmount.toFixed(2)}</td>
                  <td>
                    <select
                      className={`admin-status-select ${STATUS_COLORS[order.status] || ''}`}
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-icon-btn"
                        title="View Details"
                        onClick={() =>
                          setExpandedId(expandedId === order._id ? null : order._id)
                        }
                      >
                        <i className={`fas fa-chevron-${expandedId === order._id ? 'up' : 'down'}`}></i>
                      </button>
                      <button
                        className="admin-icon-btn danger"
                        title="Delete"
                        onClick={() => deleteOrder(order._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === order._id && (
                  <tr key={`${order._id}-detail`} className="admin-detail-row">
                    <td colSpan={7}>
                      <div className="admin-order-details gift-admin-details">
                        <div className="gift-admin-detail-grid">
                          {/* Product Info */}
                          <div className="gift-admin-detail-card">
                            <h5><i className="fas fa-box"></i> Product</h5>
                            <div className="gift-admin-product-detail">
                              <img src={order.product.imageUrl} alt={order.product.name} className="gift-admin-detail-img" />
                              <div>
                                <p><strong>{order.product.name}</strong></p>
                                <p>Size: {order.product.size} | Qty: {order.product.qty}</p>
                                <p>Rs {order.product.price.toFixed(2)} each</p>
                              </div>
                            </div>
                          </div>

                          {/* Sender Info */}
                          <div className="gift-admin-detail-card">
                            <h5><i className="fas fa-user"></i> From (Sender)</h5>
                            <p><strong>{order.senderName}</strong></p>
                            <p>{order.senderEmail}</p>
                          </div>

                          {/* Recipient Info */}
                          <div className="gift-admin-detail-card">
                            <h5><i className="fas fa-gift"></i> To (Recipient)</h5>
                            <p><strong>{order.recipientName}</strong></p>
                            <p><i className="fas fa-phone" style={{ marginRight: '6px' }}></i>{order.recipientPhone}</p>
                          </div>

                          {/* Shipping Address */}
                          <div className="gift-admin-detail-card">
                            <h5><i className="fas fa-map-marker-alt"></i> Shipping Address</h5>
                            <p>{order.shippingAddress}</p>
                          </div>
                        </div>

                        {/* Gift Message */}
                        {order.giftMessage && (
                          <div className="gift-admin-message">
                            <h5><i className="fas fa-envelope"></i> Gift Message</h5>
                            <blockquote>{order.giftMessage}</blockquote>
                          </div>
                        )}

                        <div className="gift-admin-total">
                          <span>Total Amount:</span>
                          <span>Rs {order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  No gift orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
