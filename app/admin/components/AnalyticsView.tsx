'use client';

import { useState, useEffect } from 'react';

type Period = 'weekly' | 'monthly' | 'yearly';

interface TopProduct {
  _id: string;
  totalQty: number;
  totalRevenue: number;
  imageUrl: string;
}

interface AnalyticsData {
  labels: string[];
  revenue: number[];
  orders: number[];
  topProducts: TopProduct[];
  summary: {
    totalRevenueAll: number;
    totalRevenuePeriod: number;
    totalOrdersPeriod: number;
    avgOrderValue: number;
  };
}

export default function AnalyticsView() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading analytics...</div>;
  if (!data) return <div className="admin-loading">Could not load analytics</div>;

  const maxRevenue = Math.max(...data.revenue, 1);
  const maxOrders = Math.max(...data.orders, 1);

  return (
    <div>
      <div className="admin-section-header">
        <h3>Analytics</h3>
        <div className="admin-section-actions">
          <div className="analytics-period-toggle">
            {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
              <button
                key={p}
                className={`analytics-period-btn${period === p ? ' active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: 28 }}>
        <div className="admin-stat-card admin-stat-accent">
          <div className="admin-stat-icon"><i className="fas fa-dollar-sign"></i></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">Rs {data.summary.totalRevenueAll.toFixed(2)}</span>
            <span className="admin-stat-label">All-Time Revenue</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><i className="fas fa-chart-bar"></i></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">Rs {data.summary.totalRevenuePeriod.toFixed(2)}</span>
            <span className="admin-stat-label">Period Revenue</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><i className="fas fa-shopping-bag"></i></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{data.summary.totalOrdersPeriod}</span>
            <span className="admin-stat-label">Period Orders</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><i className="fas fa-receipt"></i></div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">Rs {data.summary.avgOrderValue.toFixed(2)}</span>
            <span className="admin-stat-label">Avg Order Value</span>
          </div>
        </div>
      </div>

      <div className="admin-grid-2">
        {/* Revenue Chart */}
        <div className="admin-card">
          <h4>Revenue Trend</h4>
          <div className="analytics-chart">
            <div className="analytics-bars">
              {data.revenue.map((val, i) => (
                <div key={i} className="analytics-bar-col">
                  <div className="analytics-bar-wrap">
                    <div
                      className="analytics-bar revenue"
                      style={{ height: `${(val / maxRevenue) * 100}%` }}
                      title={`Rs ${val.toFixed(2)}`}
                    />
                  </div>
                  <span className="analytics-bar-label">{data.labels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="admin-card">
          <h4>Orders Trend</h4>
          <div className="analytics-chart">
            <div className="analytics-bars">
              {data.orders.map((val, i) => (
                <div key={i} className="analytics-bar-col">
                  <div className="analytics-bar-wrap">
                    <div
                      className="analytics-bar orders"
                      style={{ height: `${(val / maxOrders) * 100}%` }}
                      title={`${val} orders`}
                    />
                  </div>
                  <span className="analytics-bar-label">{data.labels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <h4>Top Selling Products</h4>
        {data.topProducts.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Qty Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <span className={`analytics-rank${i < 3 ? ' top' : ''}`}>#{i + 1}</span>
                    </td>
                    <td>
                      <div className="admin-product-cell">
                        <img src={p.imageUrl} alt={p._id} className="admin-thumb" />
                        <span>{p._id}</span>
                      </div>
                    </td>
                    <td>{p.totalQty}</td>
                    <td>Rs {p.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-muted" style={{ padding: '20px 0' }}>No sales data yet</p>
        )}
      </div>
    </div>
  );
}
