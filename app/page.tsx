'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section className="view active">
      {/* Hero */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="hero-content">
          <span className="hero-eyebrow fade-in-up">COLLECTION 2026</span>
          <h1 className="fade-in-up delay-1">
            Timeless<br />Elegance
          </h1>
          <div className="hero-accent-line fade-in-up delay-2"></div>
          <p className="hero-desc fade-in-up delay-2">
            Where modern sophistication meets artisanal craftsmanship.<br />
            Pieces designed to transcend seasons.
          </p>
          <div className="hero-ctas fade-in-up delay-3">
            <Link href="/products" className="btn btn-outline-light hero-btn-glow">
              SHOP NOW
            </Link>
            <Link href="/about" className="btn btn-ghost-light">
              OUR STORY
            </Link>
          </div>
        </div>
        <div className="hero-scroll-hint fade-in-up delay-3">
          <span>Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </header>

      {/* Brand Statement */}
      <section className="landing-statement" ref={addRevealRef}>
        <div className="landing-container reveal-slide-up">
          <div className="landing-gold-divider"></div>
          <span className="landing-label">THE ZAMORA DIFFERENCE</span>
          <h2 className="landing-headline">
            Fashion is not just clothing.<br />It&apos;s how you define yourself.
          </h2>
          <p className="landing-body">
            Every piece in our collection is thoughtfully designed with premium fabrics,
            impeccable tailoring, and a commitment to timeless style that lasts beyond trends.
          </p>
          <div className="landing-gold-divider"></div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="landing-categories" ref={addRevealRef}>
        <div className="landing-container reveal-slide-up">
          <div className="landing-section-top">
            <span className="landing-label">CURATED FOR YOU</span>
            <h2>Shop by Category</h2>
          </div>
          <div className="landing-cat-grid">
            <Link href="/products?category=Dresses" className="landing-cat-card landing-cat-tall">
              <div className="landing-cat-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop')" }}></div>
              <div className="landing-cat-overlay"></div>
              <div className="landing-cat-info">
                <span className="landing-cat-label-tag">BESTSELLER</span>
                <h3>Dresses</h3>
                <span className="landing-cat-cta">Explore <i className="fas fa-arrow-right"></i></span>
              </div>
            </Link>
            <Link href="/products?category=Tops" className="landing-cat-card">
              <div className="landing-cat-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop')" }}></div>
              <div className="landing-cat-overlay"></div>
              <div className="landing-cat-info">
                <span className="landing-cat-label-tag">TRENDING</span>
                <h3>Tops</h3>
                <span className="landing-cat-cta">Explore <i className="fas fa-arrow-right"></i></span>
              </div>
            </Link>
            <Link href="/products?category=Denim" className="landing-cat-card">
              <div className="landing-cat-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop')" }}></div>
              <div className="landing-cat-overlay"></div>
              <div className="landing-cat-info">
                <span className="landing-cat-label-tag">ESSENTIALS</span>
                <h3>Denim</h3>
                <span className="landing-cat-cta">Explore <i className="fas fa-arrow-right"></i></span>
              </div>
            </Link>
          </div>
          <div className="landing-cat-bottom">
            <Link href="/products" className="btn btn-secondary btn-hover-shine">
              VIEW ALL PRODUCTS <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="landing-marquee">
        <div className="landing-marquee-track">
          <span>Premium Fabrics</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Free Shipping Over Rs 5,000</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Handcrafted Quality</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Sustainable Fashion</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Premium Fabrics</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Free Shipping Over Rs 5,000</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Handcrafted Quality</span>
          <span className="landing-marquee-dot">&#9670;</span>
          <span>Sustainable Fashion</span>
          <span className="landing-marquee-dot">&#9670;</span>
        </div>
      </div>

      {/* Split Feature */}
      <section className="landing-split" ref={addRevealRef}>
        <div className="landing-split-img reveal-slide-left">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" alt="New arrivals" />
        </div>
        <div className="landing-split-text reveal-slide-right">
          <span className="landing-label">NEW ARRIVALS</span>
          <h2>Defining the<br />New Standard</h2>
          <p>
            Our latest collection draws inspiration from architectural forms
            and natural textures — a seamless blend of structure and fluidity
            for the modern woman.
          </p>
          <Link href="/new-arrivals" className="btn btn-primary btn-hover-shine">
            VIEW NEW ARRIVALS
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="landing-values" ref={addRevealRef}>
        <div className="landing-container reveal-slide-up">
          <div className="landing-section-top">
            <span className="landing-label">WHY ZAMORA</span>
            <h2>The Art of Excellence</h2>
          </div>
          <div className="landing-values-grid">
            <div className="landing-value" ref={addRevealRef}>
              <div className="landing-value-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h4>Premium Materials</h4>
              <p>Only the finest fabrics sourced from renowned mills worldwide.</p>
            </div>
            <div className="landing-value" ref={addRevealRef}>
              <div className="landing-value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h4>Sustainable Craft</h4>
              <p>Ethically produced with respect for people and the planet.</p>
            </div>
            <div className="landing-value" ref={addRevealRef}>
              <div className="landing-value-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h4>Global Delivery</h4>
              <p>Complimentary shipping on orders over Rs 5,000 worldwide.</p>
            </div>
            <div className="landing-value" ref={addRevealRef}>
              <div className="landing-value-icon">
                <i className="fas fa-undo"></i>
              </div>
              <h4>Easy Returns</h4>
              <p>Hassle-free 30-day returns for your complete satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Now Banner */}
      <section className="landing-shop-banner" ref={addRevealRef}>
        <div className="landing-shop-banner-inner reveal-slide-up">
          <span className="landing-label">READY TO EXPLORE?</span>
          <h2>Discover Your Signature Style</h2>
          <Link href="/products" className="btn btn-outline-light hero-btn-glow">
            SHOP THE COLLECTION
          </Link>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="landing-newsletter" ref={addRevealRef}>
        <div className="landing-container">
          <div className="landing-newsletter-inner reveal-slide-up">
            <span className="landing-label">STAY IN THE KNOW</span>
            <h2>Join the Zamora World</h2>
            <p>Be the first to discover new arrivals, exclusive offers, and style inspiration.</p>
            <form className="landing-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" />
              <button type="submit" className="btn btn-primary btn-hover-shine">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
}
