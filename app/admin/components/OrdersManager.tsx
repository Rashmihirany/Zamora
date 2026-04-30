'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  imageUrl: string;
}

interface PaymentDetails {
  method: 'cod' | 'card' | 'stripe';
  cardType?: 'credit' | 'debit';
  last4?: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: 'cod' | 'card' | 'stripe';
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  paymentDetails?: PaymentDetails;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    contactNumber: string;
  };
  email: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS_OPTIONS = ['unpaid', 'paid', 'failed'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'admin-badge-warning',
  processing: 'admin-badge-info',
  shipped: 'admin-badge-primary',
  delivered: 'admin-badge-success',
  cancelled: 'admin-badge-danger',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: 'admin-badge-warning',
  paid: 'admin-badge-success',
  failed: 'admin-badge-danger',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  card: 'Card Payment',
  stripe: 'Stripe',
};

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch {
      console.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchOrders();
    } catch {
      alert('Error updating order status');
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchOrders();
    } catch {
      alert('Error updating payment status');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this order permanently?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      fetchOrders();
    } catch {
      alert('Error deleting order');
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || o.paymentStatus === filterPaymentStatus;
    const matchesSearch =
      !searchTerm ||
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesPaymentStatus && matchesSearch;
  });

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <div>
      <div className="admin-section-header">
        <h3>Orders ({orders.length})</h3>
        <div className="admin-section-actions">
          <div className="admin-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search orders..."
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
          <select
            className="admin-select"
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
          >
            <option value="all">All Payment Status</option>
            {PAYMENT_STATUS_OPTIONS.map((s) => (
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
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
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
                  <td>{order.items.length}</td>
                  <td>Rs {order.totalAmount.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span className="admin-badge" title={PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || 'Unknown'}>
                        {(PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || 'Unknown').split(' ')[0]}
                      </span>
                      <select
                        className={`admin-status-select ${PAYMENT_STATUS_COLORS[order.paymentStatus] || ''}`}
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                      >
                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
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
                      <div className="admin-order-details">
                        <div style={{ marginBottom: '20px' }}>
                          <h4>Payment Information</h4>
                          <p><strong>Payment Method:</strong> {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || 'Unknown'}</p>
                          <p><strong>Payment Status:</strong> <span className={`admin-badge ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>{order.paymentStatus.toUpperCase()}</span></p>
                          {order.paymentDetails && (
                            <>
                              {order.paymentDetails.cardType && (
                                <p><strong>Card Type:</strong> {order.paymentDetails.cardType.charAt(0).toUpperCase() + order.paymentDetails.cardType.slice(1)} Card</p>
                              )}
                              {order.paymentDetails.last4 && (
                                <p><strong>Card:</strong> ••••••••••••{order.paymentDetails.last4}</p>
                              )}
                            </>
                          )}
                        </div>
                        <hr style={{ margin: '15px 0', opacity: 0.3 }} />
                        <h4>Shipping Information</h4>
                        <p><strong>User ID:</strong> {order.userId}</p>
                        <p><strong>Name:</strong> {order.shippingAddress?.fullName || 'N/A'}</p>
                        <p><strong>Address:</strong> {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zip}, ${order.shippingAddress.country}` : 'N/A'}</p>
                        <p><strong>Contact Number:</strong> {order.shippingAddress?.contactNumber || 'N/A'}</p>
                        <p><strong>Email Address:</strong> {order.email || 'N/A'}</p>
                        <hr style={{ margin: '15px 0', opacity: 0.3 }} />
                        <h4>Order Items</h4>
                        <table className="admin-inner-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Size</th>
                              <th>Qty</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <div className="admin-product-cell">
                                    <img src={item.imageUrl} alt={item.name} className="admin-thumb-sm" />
                                    <span>{item.name}</span>
                                  </div>
                                </td>
                                <td>{item.size}</td>
                                <td>{item.qty}</td>
                                <td>Rs {(item.price * item.qty).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
