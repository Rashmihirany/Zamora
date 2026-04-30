'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
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
      <header className="about-hero">
        <div
          className="about-hero-bg"
          style={{ backgroundImage: "url('/assets/about_hero.png')" }}
        ></div>
        <div className="about-hero-overlay"></div>
        <div className="hero-particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="about-hero-content">
          <span className="hero-eyebrow fade-in-up">HISTORY & PHILOSOPHY</span>
          <h1 className="fade-in-up delay-1">ZAMORA</h1>
          <div className="hero-accent-line fade-in-up delay-2"></div>
          <p className="about-hero-tagline fade-in-up delay-2">The Zenith of Minimalism</p>
        </div>
        <div className="hero-scroll-hint fade-in-up delay-3">
          <span>Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </header>

      {/* Brand Statement */}
      <section className="about-statement" ref={addRevealRef}>
        <div className="about-statement-inner reveal-slide-up">
          <div className="landing-gold-divider"></div>
          <span className="landing-label">OUR ESSENCE</span>
          <h2>The Art of Silent Luxury</h2>
          <p>
            Founded in Milan, ZAMORA was born from a simple yet powerful vision: to redefine modern
            luxury through the lens of minimalism and impeccable craftsmanship.
          </p>
          <div className="landing-gold-divider"></div>
        </div>
      </section>

      {/* Split: Quality */}
      <section className="about-split" ref={addRevealRef}>
        <div className="about-split-img reveal-slide-left">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
            alt="Craftsmanship"
            width={800}
            height={600}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        <div className="about-split-text reveal-slide-right">
          <span className="landing-label">CRAFTSMANSHIP</span>
          <h2>Uncompromising<br />Quality</h2>
          <p>
            We believe that true style doesn&apos;t shout; it whispers. Each ZAMORA piece is a
            testament to the art of restraint, designed for individuals who seek pieces that
            transcend seasons and trends.
          </p>
          <p>
            From sourcing the finest organic textiles to our commitment to ethical production,
            every detail is considered. This is fashion made with intention.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="about-stats" ref={addRevealRef}>
        <div className="about-stats-grid reveal-slide-up">
          <div className="about-stat" ref={addRevealRef}>
            <span className="about-stat-number">2018</span>
            <span className="about-stat-label">Founded in Milan</span>
          </div>
          <div className="about-stat" ref={addRevealRef}>
            <span className="about-stat-number">50+</span>
            <span className="about-stat-label">Artisan Partners</span>
          </div>
          <div className="about-stat" ref={addRevealRef}>
            <span className="about-stat-number">12</span>
            <span className="about-stat-label">Countries Served</span>
          </div>
          <div className="about-stat" ref={addRevealRef}>
            <span className="about-stat-number">100%</span>
            <span className="about-stat-label">Ethically Sourced</span>
          </div>
        </div>
      </section>

      {/* Split: Atelier (reversed) */}
      <section className="about-split about-split-reverse" ref={addRevealRef}>
        <div className="about-split-img reveal-slide-right">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop"
            alt="Studio"
            width={800}
            height={600}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        <div className="about-split-text reveal-slide-left">
          <span className="landing-label">OUR ATELIER</span>
          <h2>The Milanese<br />Heritage</h2>
          <p>
            Our pieces are designed and developed in the heart of Milan, where heritage meets
            innovation. We work with small-scale artisans who have perfected their craft over
            generations.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="about-values" ref={addRevealRef}>
        <div className="about-values-inner reveal-slide-up">
          <div className="landing-section-top">
            <span className="landing-label">WHAT WE STAND FOR</span>
            <h2>Our Pillars</h2>
          </div>
          <div className="about-values-grid">
            <div className="about-value-card" ref={addRevealRef}>
              <div className="about-value-num">01</div>
              <h4>Timeless Design</h4>
              <p>Pieces crafted to endure beyond fleeting trends, becoming cherished staples of your wardrobe.</p>
            </div>
            <div className="about-value-card" ref={addRevealRef}>
              <div className="about-value-num">02</div>
              <h4>Ethical Production</h4>
              <p>Transparent processes from raw material to finished garment, respecting both people and planet.</p>
            </div>
            <div className="about-value-card" ref={addRevealRef}>
              <div className="about-value-num">03</div>
              <h4>Artisan Excellence</h4>
              <p>Partnering with master craftspeople who bring decades of expertise to every stitch and seam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="about-cta-banner" ref={addRevealRef}>
        <div className="about-cta-inner reveal-slide-up">
          <span className="landing-label">EXPLORE THE COLLECTION</span>
          <h2>Experience Zamora</h2>
          <div className="about-cta-buttons">
            <Link href="/products" className="btn btn-outline-light hero-btn-glow">
              SHOP NOW
            </Link>
            <Link href="/contact" className="btn btn-ghost-light">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
