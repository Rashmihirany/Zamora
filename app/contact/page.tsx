'use client';

import { useEffect, useRef } from 'react';
import ContactForm from './ContactForm';

export default function ContactPage() {
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
      <header className="contact-hero">
        <div
          className="contact-hero-bg"
          style={{ backgroundImage: "url('/assets/contact_hero.png')" }}
        ></div>
        <div className="contact-hero-overlay"></div>
        <div className="hero-particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="contact-hero-content">
          <span className="hero-eyebrow fade-in-up">CLIENT SERVICES</span>
          <h1 className="fade-in-up delay-1">Get In Touch</h1>
          <div className="hero-accent-line fade-in-up delay-2"></div>
          <p className="contact-hero-desc fade-in-up delay-2">
            Bespoke support &amp; private appointments
          </p>
        </div>
        <div className="hero-scroll-hint fade-in-up delay-3">
          <span>Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="contact-content">
        <div className="contact-grid">
          {/* Left: Info */}
          <div className="contact-info" ref={addRevealRef}>
            <div className="reveal-slide-up">
              <span className="landing-label">REACH OUT</span>
              <h2 className="contact-info-heading">Private Inquiries</h2>
              <p className="contact-info-desc">
                Our client advisors are available to assist with product information,
                orders, and private appointments.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item" ref={addRevealRef}>
                  <div className="contact-detail-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4>GENERAL ENQUIRIES</h4>
                    <p>ZAMORA.ownworld@gmail.com</p>
                  </div>
                </div>

                <div className="contact-detail-item" ref={addRevealRef}>
                  <div className="contact-detail-icon">
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <div>
                    <h4>PRESS &amp; MEDIA</h4>
                    <p>ZAMORA.ownworld@gmail.com</p>

                  </div>
                </div>

                <div className="contact-detail-item" ref={addRevealRef}>
                  <div className="contact-detail-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4>TELEPHONE</h4>
                    <p>+94 76 789 3279 / +94 70 117   730</p>
                  </div>
                </div>

                <div className="contact-detail-item" ref={addRevealRef}>
                  <div className="contact-detail-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4>VISIT US</h4>
                    <p>dambuluwan,Rathnapura</p>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <h4>FOLLOW US</h4>
                <div className="contact-social-links">
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-pinterest"></i></a>
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-wrapper" ref={addRevealRef}>
            <div className="contact-form-card reveal-slide-up">
              <h3>Digital Boutique</h3>
              <p className="contact-form-subtitle">Send us a message and we&apos;ll get back to you within 24 hours.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
