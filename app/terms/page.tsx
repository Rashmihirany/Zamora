'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const termsHighlights = [
  {
    icon: 'fa-file-contract',
    title: 'BINDING AGREEMENT',
    description: 'By accessing ZAMORA.com, you enter into a legally binding agreement to adhere to these terms and conditions.',
  },
  {
    icon: 'fa-shield-halved',
    title: 'USER PROTECTION',
    description: 'We are committed to protecting your rights while ensuring fair use of our platform and services.',
  },
  {
    icon: 'fa-scale-balanced',
    title: 'LEGAL COMPLIANCE',
    description: 'All terms comply with Sri Lankan consumer protection laws and international e-commerce standards.',
  },
  {
    icon: 'fa-handshake',
    title: 'MUTUAL RESPECT',
    description: 'These terms establish a foundation of mutual respect and understanding between ZAMORA and our clients.',
  },
];

export default function TermsPage() {
  const revealRefs = useRef<HTMLElement[]>([]);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

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

    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="policies-hero">
        <div className="policies-hero-particles">
          {[...Array(8)].map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="policies-hero-content">
          <span className="policies-hero-eyebrow">ZAMORA MAISON</span>
          <h1 className="policies-hero-title">TERMS & CONDITIONS</h1>
          <div className="policies-hero-line" />
          <p className="policies-hero-subtitle">
            Legal framework governing your experience
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="policies-intro">
        <div className="policies-intro-inner" ref={addRevealRef}>
          <div className="landing-gold-divider" />
          <p>
            Welcome to ZAMORA. These Terms and Conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use ZAMORA if you do not accept all of the terms and conditions stated on this page.
          </p>
          <div className="landing-gold-divider" />
        </div>
      </section>

      {/* Highlights Cards */}
      <section className="policies-cards">
        <div className="policies-cards-grid">
          {termsHighlights.map((item, index) => (
            <div
              key={index}
              className="policies-card reveal-slide-up"
              ref={addRevealRef}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className="policies-card-icon">
                <i className={`fas ${item.icon}`} />
              </div>
              <div className="policies-card-number">0{index + 1}</div>
              <h3 className="policies-card-title">{item.title}</h3>
              <p className="policies-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="policies-shipping">
        <div className="policies-shipping-inner">
          <h2 className="policies-section-heading reveal-slide-up" ref={addRevealRef}>
            COMPREHENSIVE TERMS
          </h2>
          <p className="policies-section-subtext reveal-slide-up" ref={addRevealRef}>
            Please read these terms carefully before using our services.
          </p>

          <div className="terms-content reveal-slide-up" ref={addRevealRef}>
            <div className="terms-section">
              <h3>1. SCOPE OF ENGAGEMENT</h3>
              <p>
                By accessing ZAMORA.com, you enter into a binding agreement to adhere to these terms. Our digital boutique is designed for refined, personal acquisition only. Commercial resale or bulk purchasing requires prior written authorization from ZAMORA management.
              </p>
            </div>

            <div className="terms-section">
              <h3>2. ACQUISITION & VALUATION</h3>
              <p>
                All selections are subject to availability and formal acceptance. Pricing is inclusive of current VAT where applicable. ZAMORA reserves the right to adjust valuations in the event of unforeseen discrepancies, market fluctuations, or errors in product information. We will notify you of any price changes before processing your order.
              </p>
              <p>
                Payment must be received in full before items are dispatched. We accept major credit cards, bank transfers, and authorized Sri Lankan payment gateways.
              </p>
            </div>

            <div className="terms-section">
              <h3>3. CLIENT ACCOUNTABILITY</h3>
              <p>
                As a patron of ZAMORA, you hold the sole responsibility for maintaining the sanctity of your account credentials and all activities occurring thereunder. You must:
              </p>
              <ul>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </div>

            <div className="terms-section">
              <h3>4. INTELLECTUAL PROPERTY</h3>
              <p>
                All content, designs, logos, product images, descriptions, and trademarks displayed on this site are the exclusive property of ZAMORA and may not be reproduced, distributed, or used without express written consent. This includes but is not limited to:
              </p>
              <ul>
                <li>Product photography and imagery</li>
                <li>Website design and layout</li>
                <li>Marketing materials and copy</li>
                <li>ZAMORA brand name and logo</li>
              </ul>
            </div>

            <div className="terms-section">
              <h3>5. PRODUCT DESCRIPTIONS</h3>
              <p>
                We strive to ensure that all product descriptions, colors, and details are accurate. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered by ZAMORA is not as described, your sole remedy is to return it in unused condition within our return policy timeframe.
              </p>
            </div>

            <div className="terms-section">
              <h3>6. LIMITATION OF LIABILITY</h3>
              <p>
                ZAMORA shall not be held liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services or products, including but not limited to:
              </p>
              <ul>
                <li>Loss of profits or revenue</li>
                <li>Loss of data or business opportunities</li>
                <li>Delays in delivery due to circumstances beyond our control</li>
                <li>Damages resulting from unauthorized access to your account</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount paid by you for the specific product or service in question.
              </p>
            </div>

            <div className="terms-section">
              <h3>7. PRIVACY & DATA PROTECTION</h3>
              <p>
                Your privacy is paramount to us. We collect and process personal data in accordance with our Privacy Policy and Sri Lankan data protection regulations. By using our services, you consent to such processing and warrant that all data provided by you is accurate.
              </p>
            </div>

            <div className="terms-section">
              <h3>8. ORDER CANCELLATION</h3>
              <p>
                ZAMORA reserves the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity. If your order is cancelled after payment has been processed, we will issue a full refund to your original payment method within 5-7 business days.
              </p>
            </div>

            <div className="terms-section">
              <h3>9. GOVERNING LAW</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka.
              </p>
            </div>

            <div className="terms-section">
              <h3>10. MODIFICATIONS TO TERMS</h3>
              <p>
                ZAMORA reserves the right to modify these terms at any time. We will notify registered users of material changes via email. Your continued use of the website following any changes constitutes acceptance of those changes.
              </p>
            </div>

            <div className="terms-section">
              <h3>11. CONTACT INFORMATION</h3>
              <p>
                For questions regarding these Terms and Conditions, please contact our legal department at legal@zamora.com or through our contact page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="policies-updated">
        <div className="policies-updated-inner reveal-slide-up" ref={addRevealRef}>
          <p>
            Last updated: February 11, 2026 — These terms are subject to change. We will notify registered clients of any material updates via email. Your continued use of our services constitutes acceptance of the updated terms.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="policies-cta">
        <div className="policies-cta-inner reveal-slide-up" ref={addRevealRef}>
          <h2>QUESTIONS ABOUT OUR TERMS?</h2>
          <p>Our legal advisors are available to clarify any aspect of these terms and conditions.</p>
          <Link href="/contact" className="btn btn-primary btn-hover-shine">
            CONTACT US
          </Link>
        </div>
      </section>
    </>
  );
}
