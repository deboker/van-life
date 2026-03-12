import React from "react"
import { Link } from "react-router-dom"

const heroUrl =
  "https://images.unsplash.com/photo-1660294123554-73512d13674f?auto=format&fit=crop&w=2000&q=80";

export default function About() {
    return (
        <div className="about-page-container">
            <div
                className="about-hero-banner"
                style={{ backgroundImage: `url(${heroUrl})` }}
            />
            <div className="about-page-content">
                <h1>Don’t squeeze in a sedan when you could relax in a van.</h1>
                <p>Our mission is to enliven your road trip with the perfect travel van rental. Our vans are recertified before each trip to ensure your travel plans can go off without a hitch. (Hitch costs extra 😉)</p>
                <p>Our team is full of VanGo enthusiasts who know firsthand the magic of touring the world on 4 wheels.</p>
            </div>
            <section className="about-intro">
                <h2>About VanGo</h2>
                <p>
                    VanGo is a modern web app that connects travelers with trusted hosts who share a love
                    for life on the road. We make it effortless to discover, compare, and book camper vans —
                    with transparent pricing, responsive support, and tools that keep both guests and hosts in sync.
                </p>
                <p>
                    From weekend getaways to remote-work road trips, we focus on clarity at every step: rich photos,
                    clear house rules, fast messaging, and dependable check-in guidance. Hosts stay in control of
                    their calendars and pricing, while guests book with confidence knowing support is close at hand.
                </p>
            </section>
            <section className="home-highlights">
                <div className="highlight">
                    <p className="eyebrow">Comfort</p>
                    <h2>Pick the right rig</h2>
                    <p>Simple, rugged, or luxury — choose a layout that fits how you travel.</p>
                </div>
                <div className="highlight">
                    <p className="eyebrow">Control</p>
                    <h2>Hosts set the rules</h2>
                    <p>Transparent pricing, blackout dates, and instant updates keep everyone aligned.</p>
                </div>
                <div className="highlight">
                    <p className="eyebrow">Support</p>
                    <h2>Real humans, fast replies</h2>
                    <p>Trip changes? We respond quickly so you can stay focused on the road.</p>
                </div>
                <div
                    className="highlight highlight-photo"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80)"
                    }}
                >
                    <span className="visually-hidden">Community on the road</span>
                </div>
            </section>
            <section className="home-steps">
                <div className="steps-head">
                    <p className="eyebrow">How it works</p>
                    <h2>Your trip in three moves</h2>
                    <p className="muted">
                        From first click to drop-off, we keep it simple and transparent.
                    </p>
                </div>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M10.5 4a6.5 6.5 0 0 1 5.182 10.438l3.44 3.44a1 1 0 0 1-1.414 1.414l-3.44-3.44A6.5 6.5 0 1 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
                            </svg>
                        </div>
                        <h3>Browse</h3>
                        <p>Filter by type, price, and amenities. See honest photos before you book.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm0 6a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H7Z" />
                            </svg>
                        </div>
                        <h3>Confirm</h3>
                        <p>Lock in dates with transparent pricing and clear pickup rules.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M10.28 3.11a1 1 0 0 1 .97-.61h1.5a1 1 0 0 1 .97 1.26l-2.6 9.74a1 1 0 0 0 1.94.52l2.6-9.73A3 3 0 0 0 12.75 1h-1.5a3 3 0 0 0-2.91 3.78l2.36 8.84a1 1 0 0 0 1.93-.52l-2.35-8.84Zm-5.4 3.53A1 1 0 0 0 3 7.62V21a1 1 0 0 0 1.24.97l5.5-1.37a1 1 0 0 0 .74-.97v-5.63a1 1 0 0 0-.03-.25L4.88 6.64Zm13.84.11-6.27 7.94a1 1 0 0 0-.22.62v5.86a1 1 0 0 0 .74.97l5.5 1.37A1 1 0 0 0 20 21V7.62a1 1 0 0 0-1.28-.88Z" />
                            </svg>
                        </div>
                        <h3>Go</h3>
                        <p>Pickup made easy, in-trip chat with your host, and support if plans change.</p>
                    </div>
                </div>
            </section>
            <div className="about-page-cta">
                <h2>Vaša destinácia čaká.<br />Vaša dodávka je pripravená.</h2>
                <Link className="link-button" to="/vans">Pozrieť dodávky</Link>
            </div>
        </div>
    );
}
