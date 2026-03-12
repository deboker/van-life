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
                <h1>Netrápte sa v sedane, keď sa môžete uvoľniť v dodávke.</h1>
                <p>Našou misiou je oživiť vaše roadtripy dokonalým prenájmom dodávky. Každé auto kontrolujeme pred cestou, aby plány prebehli hladko. (Ťažné zariadenie je extra 😉)</p>
                <p>Tím tvoria nadšenci VanGo, ktorí poznajú kúzlo cestovania na štyroch kolesách z prvej ruky.</p>
            </div>
            <section className="about-intro">
                <h2>O VanGo</h2>
                <p>
                    VanGo je moderná webová aplikácia, ktorá spája cestovateľov s overenými hostiteľmi milujúcimi život na cestách.
                    Objavovanie, porovnávanie a rezervácia camperov je jednoduchá – s transparentnými cenami, rýchlou podporou
                    a nástrojmi, ktoré držia hostí aj hostiteľov v súlade.
                </p>
                <p>
                    Od víkendových únikov po roadtripy na diaľku dbáme na jasnosť v každom kroku: detailné fotky, zrozumiteľné pravidlá,
                    rýchle správy a spoľahlivé inštrukcie na check‑in. Hostitelia majú kontrolu nad kalendárom a cenami, hostia bookujú s istotou,
                    že podpora je vždy nablízku.
                </p>
            </section>
            <section className="home-highlights">
                <div className="highlight">
                    <p className="eyebrow">Komfort</p>
                    <h2>Vyberte si správne vozidlo</h2>
                    <p>Jednoduché, do terénu alebo luxusné – zvoľte dispozíciu, ktorá sedí vášmu štýlu.</p>
                </div>
                <div className="highlight">
                    <p className="eyebrow">Kontrola</p>
                    <h2>Hostitelia určujú pravidlá</h2>
                    <p>Transparentné ceny, blokované dátumy a rýchle aktualizácie držia všetkých v obraze.</p>
                </div>
                <div className="highlight">
                    <p className="eyebrow">Podpora</p>
                    <h2>Reálni ľudia, rýchle odpovede</h2>
                    <p>Mení sa plán? Odpíšeme rýchlo, aby ste sa mohli sústrediť na cestu.</p>
                </div>
                <div
                    className="highlight highlight-photo"
                    style={{
                        backgroundImage:
                            "url(/assets/images/slovakia_roads.jpg)"
                    }}
                >
                    <span className="visually-hidden">Community on the road</span>
                </div>
            </section>
            <section className="home-steps">
                <div className="steps-head">
                    <p className="eyebrow">Ako to funguje</p>
                    <h2>Váš výlet v troch krokoch</h2>
                    <p className="muted">
                        Od prvého kliknutia po odovzdanie držíme všetko jednoduché a jasné.
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
                        <p>Filtrovať podľa typu, ceny a výbavy. Pozrite si reálne fotky ešte pred rezerváciou.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm0 6a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H7Z" />
                            </svg>
                        </div>
                        <h3>Potvrdiť</h3>
                        <p>Zafixujte dátumy s transparentnou cenou a jasnými pravidlami prevzatia.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M10.28 3.11a1 1 0 0 1 .97-.61h1.5a1 1 0 0 1 .97 1.26l-2.6 9.74a1 1 0 0 0 1.94.52l2.6-9.73A3 3 0 0 0 12.75 1h-1.5a3 3 0 0 0-2.91 3.78l2.36 8.84a1 1 0 0 0 1.93-.52l-2.35-8.84Zm-5.4 3.53A1 1 0 0 0 3 7.62V21a1 1 0 0 0 1.24.97l5.5-1.37a1 1 0 0 0 .74-.97v-5.63a1 1 0 0 0-.03-.25L4.88 6.64Zm13.84.11-6.27 7.94a1 1 0 0 0-.22.62v5.86a1 1 0 0 0 .74.97l5.5 1.37A1 1 0 0 0 20 21V7.62a1 1 0 0 0-1.28-.88Z" />
                            </svg>
                        </div>
                        <h3>Vyraziť</h3>
                        <p>Jednoduché prevzatie, chat s hostiteľom počas cesty a podpora, ak sa plány zmenia.</p>
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
