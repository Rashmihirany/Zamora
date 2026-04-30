'use client';

import { useEffect, useRef } from 'react';

const policies = [
  {
    icon: 'fa-truck',
    title: 'TRACEABLE SHIPPING',
    description:
      'Complimentary delivery is extended on all orders exceeding Rs 50,000. Each piece is handled with extreme care to ensure its safe arrival. Our logistics partners provide real-time tracking from our Colombo boutique to your doorstep across Sri Lanka and beyond.',
  },
  {
    icon: 'fa-rotate-left',
    title: 'REFUND PROTOCOL',
    description:
      'We welcome returns within 14 days of delivery. Pieces must remain unworn and in their original archival packaging with all identifying tags securely attached. Refunds are processed within 5–7 business days upon receipt.',
  },
  {
    icon: 'fa-shield-halved',
    title: 'DATA STEWARDSHIP',
    description:
      'Your privacy is of paramount importance. We exclusively collect data essential for the fulfillment of your selections and the enhancement of your boutique experience. We never share personal data with third-party advertisers.',
  },
  {
    icon: 'fa-lock',
    title: 'SECURE TRANSACTIONS',
    description:
      'All payment information is encrypted using industry-standard TLS 1.3 protocols. We partner with trusted payment processors and support bank transfers, Visa, Mastercard, and popular Sri Lankan payment gateways to ensure your financial security.',
  },
];

const shippingDetails = [
  { region: 'Colombo & Suburbs', standard: '1–2 business days', express: 'Same day', freeAbove: 'Rs 15,000' },
  { region: 'Other Major Cities', standard: '2–3 business days', express: '1–2 business days', freeAbove: 'Rs 25,000' },
  { region: 'All Island (Sri Lanka)', standard: '3–5 business days', express: '1–3 business days', freeAbove: 'Rs 35,000' },
  { region: 'South Asia (India, Maldives)', standard: '5–8 business days', express: '2–4 business days', freeAbove: 'Rs 50,000' },
  { region: 'International', standard: '7–14 business days', express: '3–6 business days', freeAbove: 'Rs 75,000' },
];

const returnSteps = [
  { step: '01', title: 'Initiate Request', desc: 'Log into your account and select the item you wish to return. You may also contact our Client Services team directly via phone or WhatsApp.' },
  { step: '02', title: 'Receive Return Label', desc: 'A prepaid shipping label or courier pickup will be arranged within 24 hours of your request for addresses within Sri Lanka.' },
  { step: '03', title: 'Package & Ship', desc: 'Place the item in its original packaging with all tags attached. Hand it to the courier or drop it at any designated collection point.' },
  { step: '04', title: 'Refund Processed', desc: 'Once received and inspected, your refund will be processed within 5–7 business days to the original payment method or bank account.' },
];

const privacyPoints = [
  { icon: 'fa-database', title: 'Minimal Data Collection', desc: 'We only collect information necessary to process orders, personalize your experience, and communicate with you.' },
  { icon: 'fa-user-shield', title: 'No Third-Party Sharing', desc: 'Your personal data is never sold or shared with advertisers. We work exclusively with trusted service providers.' },
  { icon: 'fa-cookie-bite', title: 'Cookie Transparency', desc: 'We use essential cookies to optimize site performance. Optional analytics cookies require your explicit consent.' },
  { icon: 'fa-trash-alt', title: 'Right to Erasure', desc: 'You may request complete deletion of your personal data at any time. We comply within 30 days in accordance with Sri Lankan data protection regulations.' },
];

export default function PoliciesPage() {
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
          <h1 className="policies-hero-title">OUR GOVERNANCE</h1>
          <div className="policies-hero-line" />
          <p className="policies-hero-subtitle">
            Transparency &amp; trust at the heart of every interaction
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="policies-intro">
        <div className="policies-intro-inner" ref={addRevealRef}>
          <div className="landing-gold-divider" />
          <p>
            At ZAMORA, we believe that luxury extends beyond the product — it encompasses every
            touchpoint of your experience. Our policies are designed with the same meticulous
            attention to detail that defines our collections.
          </p>
          <div className="landing-gold-divider" />
        </div>
      </section>

      {/* Policy Cards */}
      <section className="policies-cards">
        <div className="policies-cards-grid">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="policies-card reveal-slide-up"
              ref={addRevealRef}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className="policies-card-icon">
                <i className={`fas ${policy.icon}`} />
              </div>
              <div className="policies-card-number">0{index + 1}</div>
              <h3 className="policies-card-title">{policy.title}</h3>
              <p className="policies-card-desc">{policy.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping Table */}
      <section className="policies-shipping">
        <div className="policies-shipping-inner">
          <h2 className="policies-section-heading reveal-slide-up" ref={addRevealRef}>
            SHIPPING RATES
          </h2>
          <p className="policies-section-subtext reveal-slide-up" ref={addRevealRef}>
            All orders are dispatched from our Colombo boutique with full insurance and tracking.
          </p>
          <div className="policies-table-wrap reveal-slide-up" ref={addRevealRef}>
            <table className="policies-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Standard</th>
                  <th>Express</th>
                  <th>Free Shipping Above</th>
                </tr>
              </thead>
              <tbody>
                {shippingDetails.map((row, i) => (
                  <tr key={i}>
                    <td>{row.region}</td>
                    <td>{row.standard}</td>
                    <td>{row.express}</td>
                    <td>{row.freeAbove}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Returns Process */}
      <section className="policies-returns">
        <div className="policies-returns-inner">
          <h2 className="policies-section-heading reveal-slide-up" ref={addRevealRef}>
            RETURN PROCESS
          </h2>
          <p className="policies-section-subtext reveal-slide-up" ref={addRevealRef}>
            We&apos;ve simplified returns to ensure a seamless experience. Follow these four steps.
          </p>
          <div className="policies-steps-grid">
            {returnSteps.map((item, i) => (
              <div
                key={i}
                className="policies-step-card reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="policies-step-number">{item.step}</span>
                <h4 className="policies-step-title">{item.title}</h4>
                <p className="policies-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="policies-privacy">
        <div className="policies-privacy-inner">
          <h2 className="policies-section-heading reveal-slide-up" ref={addRevealRef}>
            PRIVACY &amp; DATA PROTECTION
          </h2>
          <p className="policies-section-subtext reveal-slide-up" ref={addRevealRef}>
            Your trust is sacred. We are committed to transparent data practices in compliance with Sri Lankan regulations.
          </p>
          <div className="policies-privacy-grid">
            {privacyPoints.map((item, i) => (
              <div
                key={i}
                className="policies-privacy-card reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <i className={`fas ${item.icon} policies-privacy-icon`} />
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="policies-updated">
        <div className="policies-updated-inner reveal-slide-up" ref={addRevealRef}>
          <p>Last updated: January 15, 2026 — These policies are subject to change. We will notify registered clients of any material updates via email.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="policies-cta">
        <div className="policies-cta-inner reveal-slide-up" ref={addRevealRef}>
          <h2>QUESTIONS ABOUT OUR POLICIES?</h2>
          <p>Our client advisors are available to assist you with any inquiries.</p>
          <a href="/contact" className="btn btn-primary btn-hover-shine">
            CONTACT US
          </a>
        </div>
      </section>
    </>
  );
}
