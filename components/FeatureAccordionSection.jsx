import React from "react";
// Using hosted Unsplash images (square crop) aligned with each FAQ theme
const feature1 =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=1200&q=80";
const feature2 =
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&h=1200&q=80";
const feature3 =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=1200&q=80";
const feature4 =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&h=1200&q=80";
const feature5 =
  "https://images.unsplash.com/photo-1649436233160-f79565e1d787?auto=format&fit=crop&w=1200&h=1200&q=80";

const items = [
  {
    title: "Plánujte trasy rýchlejšie",
    description:
      "Vytvorte zdieľateľný itinerár s dodávkami, trasami a pokynmi na vyzdvihnutie, ktorý vaša posádka uvidí kdekoľvek.",
    image: feature1,
  },
  {
    title: "Zdieľajte s hosťami",
    description:
      "Pošlite jeden odkaz s fotkami, cenou a pravidlami. Hostia potvrdia jedným klikom, bez dohadovania.",
    image: feature2,
  },
  {
    title: "Majte poriadok",
    description:
      "Ukladajte poznámky, pridajte tagy „rodina“, „surf“ či „workation“ a nájdite správnu dodávku za pár sekúnd.",
    image: feature3,
  },
  {
    title: "Zlaďte svoj tím",
    description:
      "Zdieľajte dostupnosť a uzamknite dátumy, aby viacerí hostitelia nezarezervovali tú istú dodávku.",
    image: feature4,
  },
  {
    title: "Buďte v obraze",
    description:
      "Dostávajte upozornenia na vyzdvihnutia, vrátenia aj pripomienky servisu priamo v dashborde.",
    image: feature5,
  },
];

export default function FeatureAccordionSection() {
  const [active, setActive] = React.useState(0);

  return (
    <section className="feature-accordion">
      <div className="feature-left">
        {items.map((item, idx) => {
          const open = idx === active;
          return (
            <div
              key={item.title}
              className={`faq-item ${open ? "open" : ""}`}
              onClick={() => setActive(idx)}
            >
              <div className="faq-header">
                <h3>{item.title}</h3>
                <span className={`chevron ${open ? "up" : "down"}`}>⌃</span>
              </div>
              <div
                className="faq-body"
                style={{ maxHeight: open ? "200px" : "0px" }}
              >
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="feature-right">
        <img src={items[active].image} alt={items[active].title} />
      </div>
    </section>
  );
}
