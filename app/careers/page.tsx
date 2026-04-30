'use client';

import { useEffect, useRef } from 'react';

const positions = [
  {
    title: 'Senior Fashion Designer',
    location: 'Colombo, Sri Lanka',
    type: 'Full-time',
    department: 'Design',
    description: 'Shape the creative vision of ZAMORA\'s future collections alongside our design team. Minimum 5 years experience in fashion design required. Knowledge of Sri Lankan textile heritage is a plus.',
  },
  {
    title: 'E-commerce Manager',
    location: 'Remote / Colombo',
    type: 'Full-time',
    department: 'Digital',
    description: 'Lead our digital commerce strategy and elevate the online boutique experience. Deep expertise in e-commerce platforms and the Sri Lankan digital market.',
  },
  {
    title: 'Brand Marketing Specialist',
    location: 'Colombo, Sri Lanka',
    type: 'Full-time',
    department: 'Marketing',
    description: 'Craft compelling narratives that communicate the essence of ZAMORA across Sri Lanka and beyond. Experience with luxury brand storytelling and social media strategy.',
  },
  {
    title: 'Textile Sourcing Specialist',
    location: 'Kandy, Sri Lanka',
    type: 'Full-time',
    department: 'Supply Chain',
    description: 'Source premium sustainable fabrics from local artisans and certified mills. Ensure every material meets our rigorous quality and ethical standards. Familiarity with Sri Lankan handloom and batik traditions valued.',
  },
  {
    title: 'Client Services Advisor',
    location: 'Remote / Colombo',
    type: 'Full-time',
    department: 'Client Services',
    description: 'Provide luxury-level support to our clientele through phone, email, WhatsApp, and live chat. Fluency in Sinhala and English required; Tamil is a plus.',
  },
  {
    title: 'Visual Merchandising Intern',
    location: 'Colombo, Sri Lanka',
    type: 'Internship (6 months)',
    department: 'Creative',
    description: 'Assist the creative team in crafting stunning visual displays and editorial content for our flagship showroom and digital channels.',
  },
];

const values = [
  { icon: 'fa-palette', title: 'Creativity', text: 'We encourage bold ideas and artistic expression in everything we do.' },
  { icon: 'fa-handshake', title: 'Collaboration', text: 'Great work happens when visionary minds come together.' },
  { icon: 'fa-star', title: 'Excellence', text: 'We hold ourselves to the highest standard — in craft and in character.' },
  { icon: 'fa-leaf', title: 'Sustainability', text: 'We are committed to ethical practices and a responsible future for fashion.' },
];

const perks = [
  { icon: 'fa-plane', title: 'Annual Retreats', desc: 'Team retreats to inspiring destinations — past trips include Ella, Mirissa, Sigiriya, and the Maldives.' },
  { icon: 'fa-graduation-cap', title: 'Learning Budget', desc: 'Rs 150,000 annual learning stipend for courses, conferences, and professional development.' },
  { icon: 'fa-heart', title: 'Wellness Program', desc: 'Comprehensive health coverage plus gym memberships, mental health support, and wellness days.' },
  { icon: 'fa-tag', title: 'Employee Discount', desc: '50% off all ZAMORA collections, plus friends & family discounts throughout the year.' },
  { icon: 'fa-clock', title: 'Flexible Hours', desc: 'Work-life balance matters. Flexible scheduling and remote options for eligible roles.' },
  { icon: 'fa-baby', title: 'Parental Leave', desc: 'Generous paid parental leave for all parents — 12 weeks fully paid, with flexible return options.' },
];

const hiring = [
  { step: '01', title: 'Application Review', desc: 'Submit your CV and portfolio. Our talent team reviews every application within 5 business days.' },
  { step: '02', title: 'Initial Interview', desc: 'A 30-minute video call with our People team to discuss your background and aspirations.' },
  { step: '03', title: 'Creative Challenge', desc: 'A tailored assignment relevant to the role — designed to showcase your skills and thinking.' },
  { step: '04', title: 'Final Interview', desc: 'Meet your future team and leadership. We\'ll discuss the challenge and explore mutual fit.' },
  { step: '05', title: 'Offer & Onboarding', desc: 'Welcome to the Maison. Our structured onboarding ensures you feel at home from day one.' },
];

export default function CareersPage() {
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
      <section className="careers-hero">
        <div className="careers-hero-particles">
          {[...Array(8)].map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="careers-hero-content">
          <span className="careers-hero-eyebrow">JOIN THE MAISON</span>
          <h1 className="careers-hero-title">CAREERS</h1>
          <div className="careers-hero-line" />
          <p className="careers-hero-subtitle">
            Shape the future of luxury fashion with ZAMORA
          </p>
        </div>
      </section>

      {/* Intro Statement */}
      <section className="careers-intro">
        <div className="careers-intro-inner" ref={addRevealRef}>
          <div className="landing-gold-divider" />
          <p>
            At ZAMORA, every team member is a custodian of our craft. We seek passionate individuals
            who share our dedication to beauty, precision, and innovation. Join our growing Sri Lankan
            team where your creativity and expertise will help shape the future of modern luxury.
          </p>
          <div className="landing-gold-divider" />
        </div>
      </section>

      {/* Values Section */}
      <section className="careers-values">
        <div className="careers-values-inner">
          <h2 className="careers-section-heading reveal-slide-up" ref={addRevealRef}>
            OUR VALUES
          </h2>
          <div className="careers-values-grid">
            {values.map((v, i) => (
              <div
                key={i}
                className="careers-value-card reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <i className={`fas ${v.icon} careers-value-icon`} />
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="careers-positions">
        <div className="careers-positions-inner">
          <h2 className="careers-section-heading reveal-slide-up" ref={addRevealRef}>
            OPEN POSITIONS
          </h2>
          <p className="careers-positions-subtitle reveal-slide-up" ref={addRevealRef}>
            We&apos;re growing. Explore current opportunities across our offices in Sri Lanka.
          </p>
          <div className="careers-positions-list">
            {positions.map((pos, index) => (
              <div
                key={index}
                className="careers-position-card reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="careers-position-info">
                  <span className="careers-position-dept">{pos.department}</span>
                  <h3>{pos.title}</h3>
                  <p className="careers-position-meta">
                    <i className="fas fa-map-marker-alt" /> {pos.location} &nbsp;·&nbsp;
                    <i className="fas fa-clock" /> {pos.type}
                  </p>
                  <p className="careers-position-desc">{pos.description}</p>
                </div>
                <button className="btn btn-secondary btn-hover-shine">APPLY NOW</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="careers-perks">
        <div className="careers-perks-inner">
          <h2 className="careers-section-heading reveal-slide-up" ref={addRevealRef}>
            PERKS &amp; BENEFITS
          </h2>
          <p className="careers-perks-subtitle reveal-slide-up" ref={addRevealRef}>
            We invest in our people — because exceptional work deserves an exceptional environment.
          </p>
          <div className="careers-perks-grid">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="careers-perk-card reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <i className={`fas ${perk.icon} careers-perk-icon`} />
                <h4>{perk.title}</h4>
                <p>{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="careers-hiring">
        <div className="careers-hiring-inner">
          <h2 className="careers-section-heading reveal-slide-up" ref={addRevealRef}>
            OUR HIRING PROCESS
          </h2>
          <div className="careers-hiring-timeline">
            {hiring.map((item, i) => (
              <div
                key={i}
                className="careers-hiring-step reveal-slide-up"
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="careers-hiring-number">{item.step}</span>
                <div className="careers-hiring-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="careers-cta">
        <div className="careers-cta-inner reveal-slide-up" ref={addRevealRef}>
          <h2>DON&apos;T SEE YOUR ROLE?</h2>
          <p>We&apos;re always looking for exceptional talent. Send us your portfolio and let&apos;s start a conversation.</p>
          <a href="/contact" className="btn btn-primary btn-hover-shine">
            GET IN TOUCH
          </a>
        </div>
      </section>
    </>
  );
}
