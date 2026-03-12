import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/vanGo_icon.webp";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="site-logo">
            <img src={logo} alt="VanGo logo" />
            <span className="logo-text">VanGo</span>
          </div>
          <p className="footer-text">Stvorené na cesty. Zostaň zvedavý.</p>
        </div>
        <div>
          <h4>Podmienky</h4>
          <div className="footer-links">
            <Link to="/terms">Podmienky</Link>
            <Link to="/privacy">Súkromie</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
        <div>
          <h4>Rýchle odkazy</h4>
          <div className="footer-links">
            <Link to="/vans">Prehliadať dodávky</Link>
            <Link to="/host">Stať sa hostiteľom</Link>
            <Link to="/about">O nás</Link>
          </div>
        </div>
        <div>
          <h4>Kontakt</h4>
          <div className="footer-links">
            <a href="mailto:hello@vango.app">hello@vango.app</a>
            <a href="tel:+18005551234">+421 555-1234</a>
            <span>Podpora: Po–Ne, 8:00–20:00</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 VanGo</span>
        <span className="footer-socket">
          Vyber si dodávku. Vyraz za zážitkami.
        </span>
      </div>
    </footer>
  );
}
