import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-col brand-section">
          <Link href="/" className="footer-logo">ZAMORA</Link>
          <p className="brand-tagline">Timeless Elegance in Every Stitch</p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon" aria-label="TikTok">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Shop Section */}
        <div className="footer-col">
          <h4 className="footer-heading">SHOP</h4>
          <ul className="footer-links">
            <li><Link href="/products?category=Dresses">Dresses</Link></li>
            <li><Link href="/products?category=Tops">Tops</Link></li>
            <li><Link href="/products?category=Skirts">Skirts</Link></li>
            <li><Link href="/products?category=Trousers">Trousers</Link></li>
            <li><Link href="/products?category=Denim">Denim</Link></li>
          </ul>
        </div>

        {/* Customer Care Section */}
        <div className="footer-col">
          <h4 className="footer-heading">CUSTOMER CARE</h4>
          <ul className="footer-links">
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/policies">Policies</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-col newsletter-section">
          <h4 className="footer-heading">THE NEWSLETTER</h4>
          <p className="newsletter-text">Join the world of Zamora for exclusive updates and collections.</p>
          <div className="luxury-newsletter-form">
            <input type="email" placeholder="Email Address" className="newsletter-input" />
            <button className="newsletter-btn">SUBSCRIBE</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">ZAMORA &copy; 2026. All Rights Reserved.</p>
          <div className="legal-links">
            <Link href="/policies">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
