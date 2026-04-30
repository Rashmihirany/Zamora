'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StatCard from './components/StatCard';
import ProductsManager from './components/ProductsManager';
import OrdersManager from './components/OrdersManager';
import GiftOrdersManager from './components/GiftOrdersManager';
import UsersManager from './components/UsersManager';
import AnalyticsView from './components/AnalyticsView';
import SettingsPanel from './components/SettingsPanel';

type Tab = 'overview' | 'products' | 'orders' | 'gifts' | 'users' | 'analytics' | 'settings';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalGiftOrders: number;
  giftRevenue: number;
  recentOrders: any[];
  recentGiftOrders: any[];
  ordersByStatus: Record<string, number>;
  topProducts: { _id: string; totalQty: number; totalRevenue: number; imageUrl: string }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (status === 'loading') {
    return (
      <section className="view active">
        <div className="page-container">
          <div className="admin-loading">Loading...</div>
        </div>
      </section>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'chart-line' },
    { key: 'products', label: 'Products', icon: 'box' },
    { key: 'orders', label: 'Orders', icon: 'shopping-bag' },
    { key: 'gifts', label: 'Gifts', icon: 'gift' },
    { key: 'users', label: 'Users', icon: 'users' },
    { key: 'analytics', label: 'Analytics', icon: 'chart-bar' },
    { key: 'settings', label: 'Settings', icon: 'cog' },
  ];

  return (
    <section className="view active">
      <div className="page-container">
        <div className="admin-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p className="admin-subtitle">Manage your store</p>
          </div>
          <span className="admin-badge admin-badge-accent">
            <i className="fas fa-shield-alt"></i> {session.user.username}
          </span>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`fas fa-${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div>
              {loadingStats ? (
                <div className="admin-loading">Loading stats...</div>
              ) : stats ? (
                <>
                  <div className="admin-stats-grid">
                    <StatCard label="Total Revenue" value={`Rs ${stats.totalRevenue.toFixed(2)}`} icon="dollar-sign" accent />
                    <StatCard label="Orders" value={stats.totalOrders} icon="shopping-bag" />
                    <StatCard label="Gift Orders" value={stats.totalGiftOrders} icon="gift" />
                    <StatCard label="Products" value={stats.totalProducts} icon="box" />
                    <StatCard label="Users" value={stats.totalUsers} icon="users" />
                  </div>

                  <div className="admin-grid-2">
                    {/* Order Status Breakdown */}
                    <div className="admin-card">
                      <h4>Orders by Status</h4>
                      <div className="admin-status-list">
                        {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                          <div key={status} className="admin-status-item">
                            <span className="admin-status-name">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <span className="admin-status-count">{count}</span>
                          </div>
                        ))}
                        {Object.keys(stats.ordersByStatus).length === 0 && (
                          <p className="admin-muted">No orders yet</p>
                        )}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="admin-card">
                      <h4>Recent Orders</h4>
                      <div className="admin-recent-list">
                        {stats.recentOrders.map((order: any) => (
                          <div key={order._id} className="admin-recent-item">
                            <div>
                              <span className="admin-recent-id">#{order._id.slice(-8)}</span>
                              <span className="admin-recent-date">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className={`admin-badge ${
                                order.status === 'delivered' ? 'admin-badge-success' :
                                order.status === 'cancelled' ? 'admin-badge-danger' :
                                'admin-badge-warning'
                              }`}>
                                {order.status}
                              </span>
                              <span className="admin-recent-amount">Rs {order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        {stats.recentOrders.length === 0 && (
                          <p className="admin-muted">No recent orders</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Gift Orders */}
                  {stats.recentGiftOrders && stats.recentGiftOrders.length > 0 && (
                    <div className="admin-card" style={{ marginTop: 24 }}>
                      <h4><i className="fas fa-gift" style={{ color: 'var(--accent-color)', marginRight: '8px' }}></i>Recent Gift Orders</h4>
                      <div className="admin-recent-list">
                        {stats.recentGiftOrders.map((order: any) => (
                          <div key={order._id} className="admin-recent-item">
                            <div>
                              <span className="admin-recent-id">#{order._id.slice(-8)}</span>
                              <span className="admin-muted" style={{ marginLeft: '8px' }}>
                                {order.senderName} → {order.recipientName}
                              </span>
                            </div>
                            <div>
                              <span className={`admin-badge ${
                                order.status === 'delivered' ? 'admin-badge-success' :
                                order.status === 'cancelled' ? 'admin-badge-danger' :
                                'admin-badge-warning'
                              }`}>
                                {order.status}
                              </span>
                              <span className="admin-recent-amount">Rs {order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Selling Products */}
                  <div className="admin-card" style={{ marginTop: 24 }}>
                    <h4>Top Selling Products</h4>
                    {stats.topProducts && stats.topProducts.length > 0 ? (
                      <div className="admin-top-products">
                        {stats.topProducts.map((p, i) => (
                          <div key={p._id} className="admin-top-product-item">
                            <span className={`analytics-rank${i < 3 ? ' top' : ''}`}>#{i + 1}</span>
                            <img src={p.imageUrl} alt={p._id} className="admin-thumb" />
                            <div className="admin-top-product-info">
                              <span className="admin-top-product-name">{p._id}</span>
                              <span className="admin-muted">{p.totalQty} sold &middot; Rs {p.totalRevenue.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="admin-muted" style={{ padding: '20px 0' }}>No sales data yet</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="admin-loading">Could not load stats</div>
              )}
            </div>
          )}

          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'gifts' && <GiftOrdersManager />}
          {activeTab === 'users' && <UsersManager />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </section>
  );
}
