'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="view view-auth active">
      <div className="auth-bg"></div>
      <div className="glass-card">
        <h2 id="auth-title">LOGIN</h2>
        <div className="auth-divider"></div>
        {error && (
          <div className="auth-error">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="form-label">USERNAME</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="form-label">PASSWORD</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={isLoading}
          >
            {isLoading ? 'LOGGING IN...' : 'ENTER'}
          </button>
        </form>
        <p className="switch-auth">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}
