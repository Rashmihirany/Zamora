'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';

const categories = ['Dresses', 'Tops', 'Skirts', 'Trousers', 'Denim'];

const exploreLinks = [
  { href: '/about', label: 'Our Story' },
  { href: '/policies', label: 'Policies' },
  { href: '/careers', label: 'Careers' },
  { href: '/services', label: 'Client Services' },
  { href: '/faq', label: 'F.A.Q.' },
];

export default function SideMenu() {
  const { isSideMenuOpen, closeAll } = useStore();

  return (
    <div className={`side-menu ${isSideMenuOpen ? 'open' : ''}`}>
      <div className="menu-header">
        <span className="menu-title">NAVIGATE</span>
        <button className="icon-btn close-btn" onClick={closeAll}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="menu-content">
        <Link href="/new-arrivals" onClick={closeAll} className="side-menu-new-arrivals">
          <i className="fas fa-sparkles"></i> New Arrivals <span className="new-badge">NEW</span>
        </Link>

        <nav className="nav-categories">
          <h4>SHOP</h4>
          <ul className="menu-primary">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/products?category=${category}`}
                  onClick={closeAll}
                >
                  {category} <i className="fas fa-arrow-right"></i>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="nav-info">
          <h4>EXPLORE</h4>
          <ul className="menu-secondary">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={closeAll} className={link.highlight ? 'new-arrivals-link' : ''}>
                  {link.highlight && <i className="fas fa-sparkles" style={{ marginRight: '6px' }}></i>}
                  {link.label}
                  {link.highlight && <span className="new-badge">NEW</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-socials">
          <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
          <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social-link"><i className="fab fa-pinterest-p"></i></a>
          <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>
  );
}
