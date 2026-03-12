import React from "react";
import { Link } from "react-router-dom";
const hero1 =
  "https://images.unsplash.com/photo-1597151116153-d2e8cb44fe41?auto=format&fit=crop&w=1600&q=80";
const hero2 =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80";
const hero3 =
  "https://images.unsplash.com/photo-1629430163411-e718ffc375a6?auto=format&fit=crop&w=1600&q=80";
import { getVans } from "../api";
import FeatureAccordionSection from "../components/FeatureAccordionSection";
import TestimonialsSlider from "../components/TestimonialsSlider";

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
        const shuffled = [...data]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setFeatured(shuffled);
      } catch (err) {
        setErrorFeat(err);
      } finally {
        setLoadingFeat(false);
      }
    }
    load();
  }, []);

  const slides = [
    {
      title: "Máte plány, my máme dodávky.",
      body: "Pridajte dobrodružstvo do života s VanGo. Prenajmite si ideálnu dodávku na svoj výlet.",
      cta: "Nájsť dodávku",
      ctaLink: "vans",
    },
    {
      title: "Vyberte si kulisu, ktorá vás láka.",
      body: "Východy slnka na pláži, alpské priesmyky, púštne hviezdy — zvoľte dodávku, čo sedí k vášmu smeru.",
      cta: "Prehliadať dodávky",
      ctaLink: "vans",
    },
    {
      title: "Ponúknite svoju dodávku a zarábajte.",
      body: "Pridajte ju za pár minút, spravujte rezervácie a jazdite ďalej. Hostí riešime spolu s vami.",
      cta: "Začať hostiť",
      ctaLink: "host",
    },
  ];

  return (
    <>
      <div className="home-hero">
        <div className="slider">
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              className={`slide ${i === index ? "active" : ""}`}
              style={{ backgroundImage: `url(${[hero1, hero2, hero3][i]})` }}
            >
              <div className="slide-overlay" />
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.body}</p>
                <Link to={slide.ctaLink} className="slide-cta">
                  {slide.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="home-highlights">
        <div className="highlight">
          <p className="eyebrow">Pre nájomcov</p>
          <h2>Vyberte si dodávku na svoj výlet</h2>
          <p>Filtrovanie podľa štýlu, ceny a výbavy. Reálne fotky a detaily ešte pred rezerváciou.</p>
        </div>
        <div className="highlight">
          <p className="eyebrow">Pre hostiteľov</p>
          <h2>Pridanie za minútu, plná kontrola</h2>
          <p>Nastavte cenu, blokované dátumy a pravidlá. Kalendár aj výplaty máte prehľadné.</p>
        </div>
        <div className="highlight">
          <p className="eyebrow">Na cestách</p>
          <h2>Podpora, ktorá odpovie</h2>
          <p>Ak sa plány menia, píšete ľuďom, nie botom. Poistenie výletu na dosah.</p>
        </div>
        <div className="highlight cta-tile">
          <h3>Pripravení vyraziť?</h3>
          <div className="cta-row">
            <Link to="vans" className="pill dark">
              Nájsť dodávku
            </Link>
            <Link to="host" className="pill ghost">
              Ponúknuť dodávku
            </Link>
          </div>
        </div>
      </section>
      <section className="home-featured">
        <div className="featured-head">
          <div>
            <p className="eyebrow">Aktuálne obľúbené</p>
            <h2>Vybrané dodávky</h2>
          </div>
          <Link to="vans" className="pill ghost">
            Zobraziť všetky
          </Link>
        </div>

        {errorFeat && <p className="error">Dodávky sa nepodarilo načítať.</p>}
        <div className="featured-grid">
          {(loadingFeat ? new Array(3).fill(null) : featured).map(
            (van, idx) => (
              <div key={van?.id || idx} className="featured-card">
                <div className="featured-img-skeleton">
                  {van && <img src={van.imageUrl} alt={van?.name} />}
                </div>
                <div className="featured-meta">
                  <div>
                    <p className="van-name">{van?.name || "Načítavam..."}</p>
                    {van && (
                      <span className={`van-type-pill ${van.type}`}>
                        {van.type}
                      </span>
                    )}
                  </div>
                  <div className="price">
                    {van ? (
                      <>
                        €{van.price}
                        <span>/deň</span>
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
                  Zobraziť
                </Link>
              </div>
            ),
          )}
        </div>
      </section>
      <section className="home-steps">
        <div className="steps-head">
          <p className="eyebrow">Ako to funguje</p>
          <h2>Rezervácia v troch krokoch</h2>
          <p className="muted">
            Bez telefonátov, bez skrytých poplatkov, okamžité potvrdenie.
          </p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.5 4a6.5 6.5 0 0 1 5.182 10.438l3.44 3.44a1 1 0 0 1-1.414 1.414l-3.44-3.44A6.5 6.5 0 1 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
              </svg>
            </div>
            <h3>Vyhľadať</h3>
            <p>Filtrovať podľa typu, ceny a hodnotenia hostiteľa. Reálne fotky a jasná výbava.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm0 6a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H7Z" />
              </svg>
            </div>
            <h3>Vybrať termín</h3>
            <p>Potvrďte dátumy okamžitou rezerváciou. Transparentná cena ešte pred potvrdením.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.28 3.11a1 1 0 0 1 .97-.61h1.5a1 1 0 0 1 .97 1.26l-2.6 9.74a1 1 0 0 0 1.94.52l2.6-9.73A3 3 0 0 0 12.75 1h-1.5a3 3 0 0 0-2.91 3.78l2.36 8.84a1 1 0 0 0 1.93-.52l-2.35-8.84Zm-5.4 3.53A1 1 0 0 0 3 7.62V21a1 1 0 0 0 1.24.97l5.5-1.37a1 1 0 0 0 .74-.97v-5.63a1 1 0 0 0-.03-.25L4.88 6.64Zm13.84.11-6.27 7.94a1 1 0 0 0-.22.62v5.86a1 1 0 0 0 .74.97l5.5 1.37A1 1 0 0 0 20 21V7.62a1 1 0 0 0-1.28-.88Z" />
              </svg>
            </div>
            <h3>Vyraziť</h3>
            <p>Jednoduché pokyny na prevzatie, chat s hostiteľom počas cesty a podpora, ak sa plány menia.</p>
          </div>
        </div>
        <div className="steps-cta">
          <Link to="vans" className="pill primary">
            Zobraziť všetky dodávky
          </Link>
        </div>
      </section>
      <FeatureAccordionSection />
      <TestimonialsSlider />
      <section className="confidence-cta">
        <div>
          <p className="eyebrow">Rezervujte s istotou</p>
          <h2>
            Vaša destinácia čaká.
            <br />
            Vaša dodávka je pripravená.
          </h2>
        </div>
        <Link to="vans" className="link-button">
          Pozrieť dodávky
        </Link>
      </section>
    </>
  );
}
