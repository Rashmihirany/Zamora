'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    category: 'ORDERS & SHIPPING',
    items: [
      {
        question: 'How long does shipping take within Sri Lanka?',
        answer: 'Colombo and suburbs: 1–2 business days. Other major cities (Kandy, Galle, Negombo): 2–3 days. All other areas island-wide: 3–5 business days. Express same-day delivery is available for Colombo metro orders placed before 12 PM.',
        icon: 'fa-truck',
      },
      {
        question: 'Is shipping complimentary?',
        answer: 'Yes — complimentary island-wide shipping is provided for all orders exceeding Rs 25,000 (Rs 15,000 for Colombo). Orders below these thresholds incur a flat rate of Rs 500 for standard and Rs 1,200 for express delivery.',
        icon: 'fa-box',
      },
      {
        question: 'How can I track my order?',
        answer: 'A personalized tracking link will be sent via SMS and email once your order has been dispatched. You can also view real-time updates from your account dashboard under "My Orders."',
        icon: 'fa-location-dot',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to India, Maldives, and select international destinations. International shipping rates start at Rs 3,500. If your country is not listed at checkout, please contact our Client Services team for assistance.',
        icon: 'fa-globe',
      },
      {
        question: 'Can I change my delivery address after placing an order?',
        answer: 'Yes, you can update your delivery address within 1 hour of placing the order by contacting us via WhatsApp or calling our Client Services team. Once the order has been dispatched, address changes are no longer possible.',
        icon: 'fa-map-pin',
      },
      {
        question: 'What happens if I miss my delivery?',
        answer: 'Our courier will attempt delivery up to 3 times. If all attempts are unsuccessful, the package will be held at the nearest distribution centre for 7 days. You will be notified via SMS with pickup details. After 7 days, the order is returned to our Colombo warehouse.',
        icon: 'fa-door-open',
      },
      {
        question: 'Do you offer same-day delivery?',
        answer: 'Same-day delivery is available within the Colombo metropolitan area for orders placed before 12 PM. A flat fee of Rs 800 applies. Select "Same-Day Express" at checkout if available for your area.',
        icon: 'fa-bolt',
      },
      {
        question: 'How are orders packaged?',
        answer: 'Every order is carefully wrapped in ZAMORA\'s signature eco-friendly packaging — tissue paper, a branded dust bag, and a sturdy carton. Fragile items receive additional protective wrapping to ensure they arrive in perfect condition.',
        icon: 'fa-box-archive',
      },
    ],
  },
  {
    category: 'RETURNS & EXCHANGES',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'Pieces may be returned within 14 days of receipt, provided they remain unworn, in their original packaging with all tags and seals intact. Refunds are processed within 5–7 business days once we receive and inspect the returned item.',
        icon: 'fa-rotate-left',
      },
      {
        question: 'How do I initiate a return?',
        answer: 'Log into your account and navigate to "My Orders." Select the item you wish to return and follow the prompts. A courier pickup will be arranged within 24 hours for addresses within Sri Lanka. You may also contact us via WhatsApp for assistance.',
        icon: 'fa-arrow-right-arrow-left',
      },
      {
        question: 'Can I exchange an item for a different size?',
        answer: 'Yes. Exchanges are processed within 48 hours of receiving the returned item. If the desired size is available, it will be dispatched immediately with express shipping at no additional cost within Sri Lanka.',
        icon: 'fa-repeat',
      },
      {
        question: 'Are sale items returnable?',
        answer: 'Items purchased during promotional events are eligible for exchange or store credit only. Full refunds are available exclusively for full-price purchases.',
        icon: 'fa-tag',
      },
      {
        question: 'What if I receive a damaged or defective item?',
        answer: 'We sincerely apologize for any inconvenience. Please contact us within 48 hours of delivery with photos of the damage. We will arrange an immediate replacement or full refund, including express shipping at no cost to you.',
        icon: 'fa-triangle-exclamation',
      },
      {
        question: 'How long does it take to receive my refund?',
        answer: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. Credit/debit card refunds may take an additional 3–5 days to reflect in your statement depending on your bank. Bank transfer refunds are typically faster.',
        icon: 'fa-clock-rotate-left',
      },
      {
        question: 'Can I return an item purchased at the Colombo boutique online?',
        answer: 'Yes. Items purchased in-store can be returned either at the Colombo boutique or through our online return process. Simply contact Client Services with your receipt number and we will arrange the return for you.',
        icon: 'fa-store',
      },
    ],
  },
  {
    category: 'PAYMENTS & SECURITY',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Visa, Mastercard, and American Express credit/debit cards, bank transfers, and cash on delivery (COD) for orders within Sri Lanka. Online payments via FriMi and other local gateways are also supported. All transactions are protected by TLS 1.3 encryption.',
        icon: 'fa-credit-card',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use PCI DSS compliant payment processing — the highest security standard. Your card details are never stored on our servers. All online transactions are secured with industry-standard encryption.',
        icon: 'fa-shield-halved',
      },
      {
        question: 'Do you offer installment payments?',
        answer: 'Yes. We offer installment plans through selected Sri Lankan banks on orders above Rs 25,000. You can split your purchase into 3 or 6 monthly installments. Select "Pay in Installments" at checkout for available options.',
        icon: 'fa-coins',
      },
      {
        question: 'Is cash on delivery (COD) available?',
        answer: 'Yes. Cash on delivery is available for all orders within Sri Lanka up to Rs 100,000. Please have exact change ready as our delivery partners may not always carry change. COD is not available for international shipments.',
        icon: 'fa-money-bill-wave',
      },
      {
        question: 'Can I use multiple payment methods for one order?',
        answer: 'Currently, only one payment method can be applied per order. However, you can combine a ZAMORA gift card with any other payment method — the remaining balance will be charged to your selected payment option.',
        icon: 'fa-wallet',
      },
      {
        question: 'What currencies do you accept?',
        answer: 'All prices on our website are displayed in Sri Lankan Rupees (LKR). International orders are also processed in LKR, and your bank will convert the amount to your local currency at the prevailing exchange rate.',
        icon: 'fa-money-check',
      },
      {
        question: 'What should I do if my payment fails?',
        answer: 'If your payment is declined, please verify your card details and ensure sufficient funds are available. You can also try a different payment method. If the issue persists, contact your bank or reach out to our Client Services team for assistance.',
        icon: 'fa-circle-exclamation',
      },
    ],
  },
  {
    category: 'PRODUCT & CARE',
    items: [
      {
        question: 'How should I care for my ZAMORA pieces?',
        answer: 'Each piece is accompanied by detailed care instructions specific to its material. For leather goods, we recommend professional conditioning regularly given Sri Lanka\'s tropical climate. For silk and delicate fabrics, dry cleaning is advised. Our Lifetime Care service at the Colombo boutique offers complimentary care consultations.',
        icon: 'fa-gem',
      },
      {
        question: 'Are your materials sustainably sourced?',
        answer: 'Yes. We prioritize ethically sourced materials, including locally handwoven textiles, organic cotton, and vegetable-tanned leather. We work with Sri Lankan artisans and certified international suppliers to maintain both quality and sustainability.',
        icon: 'fa-leaf',
      },
      {
        question: 'Do you offer repairs or alterations?',
        answer: 'Our Lifetime Care program provides professional repair and restoration services for all ZAMORA pieces at our Colombo boutique. Minor alterations are complimentary within the first year. Contact our team to schedule an appointment.',
        icon: 'fa-scissors',
      },
      {
        question: 'How do I find my correct size?',
        answer: 'Each product page features a detailed size guide with measurements in both centimeters and inches. For personalized sizing advice, contact our style advisors via WhatsApp or schedule a video consultation — they can help you find the perfect fit.',
        icon: 'fa-ruler',
      },
      {
        question: 'Are product colours accurate on the website?',
        answer: 'We make every effort to display colours as accurately as possible. However, slight variations may occur due to screen settings and lighting. If you have concerns about a specific shade, our team can send you detailed close-up photos or fabric samples upon request.',
        icon: 'fa-palette',
      },
      {
        question: 'How do I store my ZAMORA pieces in Sri Lanka\'s climate?',
        answer: 'Sri Lanka\'s humidity can affect certain materials. Store leather goods in their dust bags with silica gel packets. Keep silk and fine fabrics in a cool, dry place away from direct sunlight. Avoid plastic bags — use breathable cotton garment covers instead.',
        icon: 'fa-temperature-half',
      },
      {
        question: 'Do you offer a warranty on your products?',
        answer: 'All ZAMORA pieces come with a 1-year warranty covering manufacturing defects. Leather goods and jewelry carry an extended 2-year warranty. The warranty does not cover normal wear and tear or damage resulting from improper care.',
        icon: 'fa-certificate',
      },
    ],
  },
  {
    category: 'GIFTING & SPECIAL ORDERS',
    items: [
      {
        question: 'Do you offer gift wrapping?',
        answer: 'Yes. Our Gift Concierge service provides bespoke wrapping in ZAMORA\'s signature packaging, with personalized handwritten notes and direct delivery to your recipient anywhere in Sri Lanka. This service is complimentary on all orders.',
        icon: 'fa-gift',
      },
      {
        question: 'Can I purchase a gift card?',
        answer: 'Digital gift cards are available in denominations of Rs 5,000, Rs 10,000, Rs 25,000, Rs 50,000, and Rs 100,000. They are delivered instantly via email and never expire. Physical gift cards in our signature presentation box can be ordered through Client Services.',
        icon: 'fa-wallet',
      },
      {
        question: 'Do you accept custom or made-to-order requests?',
        answer: 'Selected pieces can be customized in exclusive colorways or materials. Made-to-order items typically require 3–6 weeks. Please contact our design team at design@zamora.lk to discuss your vision.',
        icon: 'fa-wand-magic-sparkles',
      },
      {
        question: 'Can I send a gift directly to someone else?',
        answer: 'Absolutely. During checkout, simply enter the recipient\'s address as the delivery address. You can add a personalized message and opt for gift wrapping. The invoice will not be included with the delivery.',
        icon: 'fa-paper-plane',
      },
      {
        question: 'Do you offer corporate or bulk gifting?',
        answer: 'Yes. We offer bespoke corporate gifting solutions for Avurudu, Christmas, and other occasions. Enjoy special pricing on bulk orders of 10 or more items. Contact our Gift Concierge at gifts@zamora.lk for a custom proposal.',
        icon: 'fa-building',
      },
      {
        question: 'Can I schedule a delivery for a specific date?',
        answer: 'Yes. For gift orders within Sri Lanka, you can select a preferred delivery date at checkout. We recommend booking at least 3 days in advance to guarantee your chosen date, especially during festive seasons like Avurudu, Vesak, and Christmas.',
        icon: 'fa-calendar-check',
      },
      {
        question: 'Can the recipient exchange a gift?',
        answer: 'Yes. Gift recipients can exchange items for a different size or colour within 14 days of delivery. They can visit our Colombo boutique or contact Client Services with the order reference number. Exchanges are processed without revealing the purchase price.',
        icon: 'fa-right-left',
      },
    ],
  },
  {
    category: 'ACCOUNT & PRIVACY',
    items: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Sign Up" in the top navigation and enter your email address or mobile number. Account holders enjoy faster checkout, order tracking, wish lists, and early access to new collections and exclusive events.',
        icon: 'fa-user-plus',
      },
      {
        question: 'How is my personal data used?',
        answer: 'We collect only the information necessary to process orders and enhance your experience. Your data is never sold or shared with third-party advertisers. We comply with Sri Lankan data protection regulations, and you may request data deletion at any time.',
        icon: 'fa-lock',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Login" and then select "Forgot Password." Enter your registered email or mobile number, and a reset link will be sent to you within minutes. For security, the link expires after 24 hours.',
        icon: 'fa-key',
      },
      {
        question: 'Can I update my account details?',
        answer: 'Yes. Log into your account and navigate to "Profile Settings." You can update your name, email, phone number, delivery addresses, and communication preferences at any time.',
        icon: 'fa-user-pen',
      },
      {
        question: 'How do I delete my account?',
        answer: 'You can request account deletion by contacting our Client Services team via email at concierge@zamora.lk or through WhatsApp. We will process your request within 7 business days and confirm deletion via email. All personal data will be permanently removed.',
        icon: 'fa-user-xmark',
      },
      {
        question: 'Do you send promotional communications?',
        answer: 'We send email and SMS updates about new collections, exclusive offers, and events only if you opt in during registration. You can manage your preferences or unsubscribe at any time from your account settings or by clicking "Unsubscribe" in any email.',
        icon: 'fa-bell',
      },
      {
        question: 'Is my browsing activity tracked?',
        answer: 'We use essential cookies to ensure the website functions properly. Analytics cookies are only activated with your explicit consent when you first visit our site. You can manage your cookie preferences at any time through the cookie settings in the website footer.',
        icon: 'fa-eye',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(0);
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

  const toggleAccordion = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <section className="view active">
      {/* Hero Section */}
      <header className="faq-hero">
        <div className="faq-hero-bg"></div>
        <div className="faq-hero-overlay"></div>
        <div className="hero-particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="faq-hero-content">
          <span className="hero-eyebrow fade-in-up">ASSISTANCE & SUPPORT</span>
          <h1 className="fade-in-up delay-1">
            Frequently Asked<br />Questions
          </h1>
          <div className="hero-accent-line fade-in-up delay-2"></div>
        </div>
        <div className="hero-scroll-hint fade-in-up delay-3">
          <span>Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="faq-intro" ref={addRevealRef}>
        <div className="landing-container reveal-slide-up">
          <div className="landing-gold-divider"></div>
          <span className="landing-label">WE'RE HERE TO HELP</span>
          <h2 className="landing-headline">
            Find answers to common questions<br />or reach our support team
          </h2>
          <p className="landing-body">
            We've organized our FAQ into {totalQuestions} detailed answers across key topics. 
            Select a category below and explore, or get in touch directly with our Client Services team.
          </p>
          <div className="landing-gold-divider"></div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="faq-categories-section" ref={addRevealRef}>
        <div className="landing-container">
          <div className="faq-tabs-grid">
            {faqCategories.map((cat, i) => (
              <button
                key={i}
                className={`faq-category-btn reveal-slide-up ${activeCategory === i ? 'faq-category-active' : ''}`}
                onClick={() => { setActiveCategory(i); setOpenIndex(null); }}
                ref={addRevealRef}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <span className="faq-category-text">{cat.category}</span>
                <span className="faq-category-count">{cat.items.length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="faq-accordion-section">
        <div className="landing-container reveal-slide-up" ref={addRevealRef}>
          <div className="faq-accordion-header-label">
            <h3 className="landing-label" style={{ marginBottom: 0 }}>
              {faqCategories[activeCategory].category}
            </h3>
          </div>
          <div className="faq-accordion-list">
            {faqCategories[activeCategory].items.map((item, index) => {
              const key = `${activeCategory}-${index}`;
              const isOpen = openIndex === key;
              return (
                <div
                  key={key}
                  className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                  ref={addRevealRef}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <button
                    className="faq-item-header"
                    onClick={() => toggleAccordion(key)}
                  >
                    <div className="faq-item-header-left">
                      <div className="faq-item-icon">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <h4 className="faq-item-question">{item.question}</h4>
                    </div>
                    <div className="faq-item-toggle">
                      <svg
                        className={`faq-item-chevron ${isOpen ? 'open' : ''}`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 8L10 12L14 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <div className="faq-item-body-wrapper">
                    <div className="faq-item-body">
                      <p className="faq-item-answer">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="faq-contact-section" ref={addRevealRef}>
        <div className="landing-container">
          <div className="landing-section-top reveal-slide-up">
            <span className="landing-label">OTHER WAYS TO REACH US</span>
            <h2>Connect with Our Team</h2>
          </div>

          <div className="faq-contact-cards-grid">
            <div className="faq-contact-card-item reveal-slide-up" ref={addRevealRef}>
              <div className="faq-contact-card-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="faq-contact-card-title">Email</h3>
              <p className="faq-contact-card-value">concierge@zamora.lk</p>
              <span className="faq-contact-card-note">Response within 2 hours</span>
            </div>

            <div className="faq-contact-card-item reveal-slide-up" ref={addRevealRef} style={{ transitionDelay: '0.1s' }}>
              <div className="faq-contact-card-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3 className="faq-contact-card-title">Phone</h3>
              <p className="faq-contact-card-value">+94 11 234 5678</p>
              <span className="faq-contact-card-note">Mon–Sat, 9 AM – 7 PM</span>
            </div>

            <div className="faq-contact-card-item reveal-slide-up" ref={addRevealRef} style={{ transitionDelay: '0.2s' }}>
              <div className="faq-contact-card-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="faq-contact-card-title">WhatsApp</h3>
              <p className="faq-contact-card-value">+94 77 123 4567</p>
              <span className="faq-contact-card-note">Instant messaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="faq-cta-section" ref={addRevealRef}>
        <div className="landing-container reveal-slide-up">
          <div className="faq-cta-content">
            <span className="landing-label">NEED MORE HELP?</span>
            <h2>Send us a Message</h2>
            <p>Our expert team is ready to assist with any questions or special requests.</p>
            <Link href="/contact" className="btn btn-outline-light hero-btn-glow">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
