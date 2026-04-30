'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useStore } from '@/store/useStore';

const HIDE_SEARCH_PATHS = ['/', '/auth/login', '/auth/register'];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleSideMenu, toggleCart, cartCount } = useStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  const showSearch = !HIDE_SEARCH_PATHS.includes(pathname);

  return (
      <nav className="navbar">
        <div className="nav-left">
          <button className="icon-btn" onClick={toggleSideMenu}>
            <i className="fas fa-bars"></i>
          </button>
          {showSearch && (
            <div className="search-bar hidden-mobile">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          )}
        </div>
        <div className="nav-center">
          <Link href="/" className="logo">ZAMORA</Link>
        </div>
        <div className="nav-right">
          {session ? (
            <>
              {session.user.role === 'admin' && (
                <Link href="/admin" className="auth-link admin-nav-link">
                  <i className="fas fa-shield-alt"></i>ADMIN
                </Link>
              )}
              <button 
                onClick={() => signOut()} 
                className="auth-link"
              >
                LOGOUT ({session.user.username})
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="auth-link">
              LOGIN
            </Link>
          )}
          <button className="icon-btn" onClick={() => toggleCart(true)}>
            <i className="fas fa-shopping-bag"></i>
            <span id="cart-count">{hydrated ? cartCount() : 0}</span>
          </button>
        </div>
      </nav>
  );
}
