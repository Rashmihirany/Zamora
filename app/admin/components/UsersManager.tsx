'use client';

import { useState, useEffect } from 'react';

interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch {
      console.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (
      newRole === 'admin' &&
      !confirm(`Promote "${user.username}" to admin?`)
    )
      return;
    if (
      newRole === 'user' &&
      !confirm(`Remove admin from "${user.username}"?`)
    )
      return;

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to update user');
        return;
      }
      fetchUsers();
    } catch {
      alert('Error updating user role');
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete user "${user.username}" permanently?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error deleting user');
        return;
      }
      fetchUsers();
    } catch {
      alert('Error deleting user');
    }
  };

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterError('');
    setRegisterSuccess('');

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegisterError(data.error || 'Failed to register admin');
        return;
      }

      setRegisterSuccess(`Admin "${data.user.username}" registered successfully!`);
      setRegisterUsername('');
      setRegisterPassword('');
      fetchUsers();

      // Close modal after 1.5s
      setTimeout(() => {
        setShowRegisterForm(false);
        setRegisterSuccess('');
      }, 1500);
    } catch {
      setRegisterError('An error occurred during registration');
    } finally {
      setRegistering(false);
    }
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading users...</div>;

  return (
    <div>
      <div className="admin-section-header">
        <h3>Users ({users.length})</h3>
        <div className="admin-section-actions">
          <div className="admin-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary admin-btn"
            onClick={() => {
              setShowRegisterForm(true);
              setRegisterError('');
              setRegisterSuccess('');
              setRegisterUsername('');
              setRegisterPassword('');
            }}
          >
            <i className="fas fa-user-plus"></i> Register Admin
          </button>
        </div>
      </div>

      {/* Register Admin Modal */}
      {showRegisterForm && (
        <div className="admin-modal-overlay" onClick={() => setShowRegisterForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Register New Admin</h3>
              <button className="admin-modal-close" onClick={() => setShowRegisterForm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleRegisterAdmin} className="admin-form">
              {registerError && <div className="admin-error">{registerError}</div>}
              {registerSuccess && <div className="admin-success">{registerSuccess}</div>}

              <div className="admin-field">
                <label>Username</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="Enter admin username"
                />
              </div>
              <div className="admin-field">
                <label>Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter admin password"
                />
              </div>
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRegisterForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={registering}
                >
                  {registering ? 'Registering...' : 'Register Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="admin-user-cell">
                    <div className="admin-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`admin-badge ${
                      user.role === 'admin' ? 'admin-badge-accent' : 'admin-badge-default'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-icon-btn"
                      title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      onClick={() => toggleRole(user)}
                    >
                      <i className={`fas fa-${user.role === 'admin' ? 'user-minus' : 'user-shield'}`}></i>
                    </button>
                    <button
                      className="admin-icon-btn danger"
                      title="Delete User"
                      onClick={() => deleteUser(user)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
