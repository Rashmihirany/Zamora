'use client';

import { useEffect, useRef } from 'react';

const services = [
  {
    icon: 'fa-shipping-fast',
    title: 'Express Delivery',
    description:
      'Complimentary island-wide shipping on all orders over Rs 25,000. Careful handling ensures every piece arrives in pristine condition.',
  },
  {
    icon: 'fa-box-open',
    title: 'Easy Returns',
    description:
      'Complimentary returns pickup service within 14 days for addresses across Sri Lanka. We make the process effortless so you can shop with confidence.',
  },
  {
    icon: 'fa-gem',
    title: 'Lifetime Care',
    description:
      'Professional repair and restoration services available for all leather goods and fine jewelry pieces at our Colombo boutique.',
  },
  {
    icon: 'fa-user-tie',
    title: 'Personal Styling',
    description:
      'Book a complimentary session with our style advisors for curated recommendations tailored to your aesthetic — in-store or via video call.',
  },
  {
    icon: 'fa-gift',
    title: 'Gift Concierge',
    description:
      'Our specialists assist with bespoke gifting — from custom wrapping to personalized messages for every occasion, including Avurudu and festive seasons.',
  },
  {
    icon: 'fa-phone-alt',
    title: 'Dedicated Support',
    description:
      'Reach our client advisors via phone, email, WhatsApp, or live chat for any assistance during business hours.',
  },
];

const processSteps = [
  { number: '01', title: 'Discover', desc: 'Browse our curated collections online or visit our Colombo showroom for a private viewing experience.' },
  { number: '02', title: 'Personalize', desc: 'Connect with a style advisor who will tailor recommendations to your preferences, lifestyle, and wardrobe.' },
  { number: '03', title: 'Order', desc: 'Place your order with confidence — every purchase is backed by our satisfaction guarantee and secure checkout.' },
  { number: '04', title: 'Receive', desc: 'Your selection arrives in our signature packaging with careful delivery and real-time tracking across Sri Lanka.' },
  { number: '05', title: 'Enjoy', desc: 'Your relationship with ZAMORA doesn\'t end at delivery. Access Lifetime Care, styling refreshes, and priority access to new collections.' },
];

const contactChannels = [
  { icon: 'fa-envelope', title: 'Email', detail: 'concierge@zamora.lk', desc: 'Response within 2 hours during business hours.' },
  { icon: 'fa-phone', title: 'Phone', detail: '+94 11 234 5678', desc: 'Available Mon–Sat, 9 AM – 7 PM in Sinhala, Tamil, and English.' },
  { icon: 'fa-comments', title: 'Live Chat & WhatsApp', detail: '+94 77 123 4567', desc: 'Instant connection with a client advisor via chat or WhatsApp.' },
  { icon: 'fa-video', title: 'Video Consultation', detail: 'By appointment', desc: 'Schedule a face-to-face virtual styling or product consultation.' },
];

const stats = [
  { value: '98%', label: 'Client Satisfaction' },
  { value: '<2hr', label: 'Average Response Time' },
  { value: '3', label: 'Languages Supported' },
  { value: 'Mon–Sat', label: 'Availability' },
];

export default function ServicesPage() {
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
      <section className="services-hero">
        <div className="services-hero-particles">
          {[...Array(8)].map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="services-hero-content">
          <span className="services-hero-eyebrow">THE ZAMORA EXPERIENCE</span>
          <h1 className="services-hero-title">CLIENT SERVICES</h1>
          <div className="services-hero-line" />
          <p className="services-hero-subtitle">
            Exceptional care at every step of your journey
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="services-intro">
        <div className="services-intro-inner" ref={addRevealRef}>
          <div className="landing-gold-divider" />
          <p>
            From the moment you discover ZAMORA to years after your purchase, our dedicated team
            ensures an experience that matches the quality of our collections. Every interaction
            is designed to feel personal, seamless, and truly luxurious.
          </p>
          <div className="landing-gold-divider" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="services-card reveal-slide-up"
              ref={addRevealRef}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="services-card-icon-wrap">
                <i className={`fas ${service.icon}`} />
              </div>
              <h3 className="services-card-title">{service.title}</h3>
              <p className="services-card-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Stats */}
      <section className="services-stats">
        <div className="services-stats-grid reveal-slide-up" ref={addRevealRef}>
          {stats.map((stat, i) => (
            <div key={i} className="services-stat-item">
              <span className="services-stat-value">{stat.value}</span>
              <span className="services-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="services-process">
        <div className="services-process-inner">
          <h2 className="services-section-heading reveal-slide-up" ref={addRevealRef}>
            THE ZAMORA JOURNEY
          </h2>
          <p className="services-section-subtext reveal-slide-up" ref={addRevealRef}>
            From discovery to delivery and beyond — here&apos;s what your experience looks like.
          </p>
          <div className="services-process-timeline">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className="services-process-step reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="services-process-number">{step.number}</span>
                <div className="services-process-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="services-channels">
        <div className="services-channels-inner">
          <h2 className="services-section-heading reveal-slide-up" ref={addRevealRef}>
            REACH US
          </h2>
          <p className="services-section-subtext reveal-slide-up" ref={addRevealRef}>
            Multiple ways to connect — choose whichever suits you best.
          </p>
          <div className="services-channels-grid">
            {contactChannels.map((ch, i) => (
              <div
                key={i}
                className="services-channel-card reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <i className={`fas ${ch.icon} services-channel-icon`} />
                <h4>{ch.title}</h4>
                <span className="services-channel-detail">{ch.detail}</span>
                <p>{ch.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Banner */}
      <section className="services-banner">
        <div className="services-banner-inner reveal-slide-up" ref={addRevealRef}>
          <h2>OUR COMMITMENT</h2>
          <p>
            Every interaction with ZAMORA is an extension of our craft — meticulous, personal, and
            uncompromising. We don&apos;t just sell luxury; we deliver it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <div className="services-cta-inner reveal-slide-up" ref={addRevealRef}>
          <h2>NEED ASSISTANCE?</h2>
          <p>Our advisors are ready to help with any request, large or small.</p>
          <a href="/contact" className="btn btn-primary btn-hover-shine">
            REACH OUT
          </a>
        </div>
      </section>
    </>
  );
}
