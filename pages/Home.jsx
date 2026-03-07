import React from "react";
import { Link } from "react-router-dom";
import hero1 from "../assets/images/home-hero.png";
import hero2 from "../assets/images/about-hero.png";
const hero3 =
  "https://assets.scrimba.com/advanced-react/react-router/green-wonder.png";
import { getVans } from "../api";

const slides = [
  {
    title: "You got the travel plans, we got the travel vans.",
    body: "Add adventure to your life by joining the #vanlife movement. Rent the perfect van to make your perfect road trip.",
    cta: "Find your van",
    image: hero1,
  },
  {
    title: "Stay curious. Choose your backdrop.",
    body: "Beach sunrises, alpine passes, desert stars — pick a van that matches the route you dream about.",
    cta: "Browse vans",
    image: hero2,
  },
  {
    title: "Host your van, earn on the road.",
    body: "List your camper in minutes, manage bookings, and keep rolling. We handle the guests.",
    cta: "Start hosting",
    image: hero3,
  },
];

export default function Home() {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);
  const [featured, setFeatured] = React.useState([]);
  const [loadingFeat, setLoadingFeat] = React.useState(false);
  const [errorFeat, setErrorFeat] = React.useState(null);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  const goTo = (i) => setIndex(i % slides.length);

  React.useEffect(() => {
    async function load() {
      setLoadingFeat(true);
      try {
        const data = await getVans();
        setFeatured(data.slice(0, 3));
      } catch (err) {
        setErrorFeat(err);
      } finally {
        setLoadingFeat(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="home-hero">
        <div className="slider">
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              className={`slide ${i === index ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-overlay" />
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.body}</p>
                <Link to={i === 2 ? "host" : "vans"} className="slide-cta">
                  {slide.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <section className="home-highlights">
        <div className="highlight">
          <p className="eyebrow">For renters</p>
          <h2>Pick a van that fits the trip</h2>
          <p>
            Filter by style, price, and amenities. See honest photos and details
            before you book.
          </p>
        </div>
        <div className="highlight">
          <p className="eyebrow">For hosts</p>
          <h2>List in minutes, stay in control</h2>
          <p>
            Set your price, blackout dates, and rules. We keep your calendar and
            payouts tidy.
          </p>
        </div>
        <div className="highlight">
          <p className="eyebrow">On the road</p>
          <h2>Support that actually answers</h2>
          <p>
            Chat with humans, not bots, if plans change. Trip insurance options
            included.
          </p>
        </div>
        <div className="highlight cta-tile">
          <h3>Ready to roll?</h3>
          <div className="cta-row">
            <Link to="vans" className="pill dark">
              Find a van
            </Link>
            <Link to="host" className="pill ghost">
              Host your van
            </Link>
          </div>
        </div>
      </section>
      <section className="home-featured">
        <div className="featured-head">
          <div>
            <p className="eyebrow">Popular right now</p>
            <h2>Featured vans</h2>
          </div>
          <Link to="vans" className="pill ghost">
            View all vans
          </Link>
        </div>

        {errorFeat && <p className="error">Could not load vans.</p>}
        <div className="featured-grid">
          {(loadingFeat ? new Array(3).fill(null) : featured).map(
            (van, idx) => (
              <div key={van?.id || idx} className="featured-card">
                <div className="featured-img-skeleton">
                  {van && <img src={van.imageUrl} alt={van?.name} />}
                </div>
                <div className="featured-meta">
                  <div>
                    <p className="van-name">{van?.name || "Loading..."}</p>
                    {van && (
                      <span className={`van-type-pill ${van.type}`}>
                        {van.type}
                      </span>
                    )}
                  </div>
                  <div className="price">
                    {van ? (
                      <>
                        ${van.price}
                        <span>/day</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
                <Link
                  to={van ? `vans/${van.id}` : "#"}
                  className="pill primary block"
                >
                  View
                </Link>
              </div>
            ),
          )}
        </div>
      </section>
      <section className="home-steps">
        <div className="steps-head">
          <p className="eyebrow">How it works</p>
          <h2>Book in three easy steps</h2>
          <p className="muted">
            Zero phone calls, no hidden fees, instant confirmation.
          </p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">🔍</div>
            <h3>Browse</h3>
            <p>
              Filter by type, price, and host rating. Every van has real photos
              and clear amenities.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">📅</div>
            <h3>Pick dates</h3>
            <p>
              Lock in your dates with instant booking. Transparent pricing
              before you click confirm.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">🛣️</div>
            <h3>Hit the road</h3>
            <p>
              Easy pickup instructions, in-trip chat with the host, and support
              from our team if plans change.
            </p>
          </div>
        </div>
        <div className="steps-cta">
          <Link to="vans" className="pill primary">
            See all vans
          </Link>
        </div>
      </section>
    </>
  );
}
