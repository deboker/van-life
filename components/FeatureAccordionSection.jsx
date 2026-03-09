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
    title: "Plan trips faster",
    description:
      "Create a shareable itinerary with vans, routes, and pickup details that your crew can see anywhere.",
    image: feature1,
  },
  {
    title: "Share with guests",
    description:
      "Send a single link with photos, pricing, and rules. Guests confirm in one click, no back-and-forth.",
    image: feature2,
  },
  {
    title: "Stay organized",
    description:
      "Keep notes, add tags like “family”, “surf”, or “workcation” and find the right van in seconds.",
    image: feature3,
  },
  {
    title: "Sync your team",
    description:
      "Share availability and lock dates so multiple hosts don’t double‑book the same van.",
    image: feature4,
  },
  {
    title: "Stay in the loop",
    description:
      "Get alerts for pickups, returns, and maintenance reminders right in your dashboard.",
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
