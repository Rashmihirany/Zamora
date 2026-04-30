'use client';

import { useState, useEffect } from 'react';

interface SettingsData {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  notifications: {
    emailOnOrder: boolean;
    emailOnLowStock: boolean;
    emailOnNewUser: boolean;
  };
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

const defaultSettings: SettingsData = {
  storeName: 'ZAMORA',
  storeEmail: 'contact@zamora.com',
  storePhone: '+1 (555) 000-0000',
  storeAddress: '123 Fashion Ave, New York, NY 10001',
  currency: 'USD',
  timezone: 'America/New_York',
  maintenanceMode: false,
  notifications: {
    emailOnOrder: true,
    emailOnLowStock: true,
    emailOnNewUser: false,
  },
};

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          storeName: data.storeName || defaultSettings.storeName,
          storeEmail: data.storeEmail || defaultSettings.storeEmail,
          storePhone: data.storePhone || defaultSettings.storePhone,
          storeAddress: data.storeAddress || defaultSettings.storeAddress,
          currency: data.currency || defaultSettings.currency,
          timezone: data.timezone || defaultSettings.timezone,
          maintenanceMode: data.maintenanceMode ?? false,
          notifications: {
            emailOnOrder: data.notifications?.emailOnOrder ?? true,
            emailOnLowStock: data.notifications?.emailOnLowStock ?? true,
            emailOnNewUser: data.notifications?.emailOnNewUser ?? false,
          },
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save settings');
        return;
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading settings...</div>;

  return (
    <div>
      <div className="admin-section-header">
        <h3>Store Settings</h3>
      </div>

      <form onSubmit={handleSave}>
        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {/* Store Information */}
        <div className="admin-card settings-section">
          <h4><i className="fas fa-store"></i> Store Information</h4>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label>Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label>Phone</label>
              <input
                type="text"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Address</label>
              <input
                type="text"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="admin-card settings-section">
          <h4><i className="fas fa-globe"></i> Regional</h4>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="admin-card settings-section">
          <h4><i className="fas fa-tools"></i> Maintenance</h4>
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">Maintenance Mode</span>
              <span className="settings-toggle-desc">
                When enabled, the store displays a maintenance page to visitors
              </span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
              />
              <span className="settings-slider"></span>
            </label>
          </div>
          {settings.maintenanceMode && (
            <div className="settings-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Maintenance mode is ON — customers cannot access the store
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="admin-card settings-section">
          <h4><i className="fas fa-bell"></i> Notifications</h4>
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">New Order Emails</span>
              <span className="settings-toggle-desc">Receive an email when a new order is placed</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.notifications.emailOnOrder}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailOnOrder: e.target.checked },
                  })
                }
              />
              <span className="settings-slider"></span>
            </label>
          </div>
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">Low Stock Alerts</span>
              <span className="settings-toggle-desc">Get notified when products are running low</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.notifications.emailOnLowStock}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailOnLowStock: e.target.checked },
                  })
                }
              />
              <span className="settings-slider"></span>
            </label>
          </div>
          <div className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">New User Registration</span>
              <span className="settings-toggle-desc">Get notified when a new user registers</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.notifications.emailOnNewUser}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailOnNewUser: e.target.checked },
                  })
                }
              />
              <span className="settings-slider"></span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-save-bar">
          <button
            type="submit"
            className="btn btn-primary admin-btn"
            disabled={saving}
          >
            <i className="fas fa-save"></i>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
