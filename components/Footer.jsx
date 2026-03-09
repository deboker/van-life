import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="site-logo">#VanLife</div>
          <p className="footer-text">
            Find, book, or host camper vans with confidence. Built for flexible
            travel and responsive hosts.
          </p>
        </div>
        <div>
          <h4>Legal</h4>
          <div className="footer-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
        <div>
          <h4>Fast links</h4>
          <div className="footer-links">
            <Link to="/vans">Browse vans</Link>
            <Link to="/host">Become a host</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
        <div>
          <h4>Contact</h4>
          <div className="footer-links">
            <a href="mailto:hello@vanlife.app">hello@vanlife.app</a>
            <a href="tel:+18005551234">+1 (800) 555-1234</a>
            <span>Support: Mon–Sun, 8am–8pm</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 #VanLife</span>
        <span className="footer-socket">Built for the road. Stay curious.</span>
      </div>
    </footer>
  );
}
