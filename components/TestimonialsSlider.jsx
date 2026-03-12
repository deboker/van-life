import React from "react";

const testimonials = [
  {
    name: "Mara S.",
    role: "Solo cestovateľka",
    text: "Rezervovala som do 5 minút a pokyny na vyzdvihnutie boli úplne jasné.",
    avatar: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Diego R.",
    role: "Hostiteľ · Portland",
    text: "Synchronizácia kalendára a okamžité upozornenia – už dvojmo nebookujem.",
    avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Anika P.",
    role: "Víkendová kemperka",
    text: "Detailné fotky – to, čo som videla online, som dostala aj pri vyzdvihnutí.",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Caleb H.",
    role: "Pracujem na diaľku",
    text: "Vysoká strecha, spoľahlivé soláry a jednoduché odovzdanie. Cestovná kancelária odomknutá.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Zoë L.",
    role: "Rodina štyroch",
    text: "Filtre mi rýchlo našli rodinný layout a pripravené detské sedačky.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80&sat=20",
  },
  {
    name: "Priya N.",
    role: "Hostiteľka · Denver",
    text: "Tipy na ceny mi vypĺňajú pracovné dni bez znižovania cien na víkend.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&h=160&q=80&sat=-10",
  },
  {
    name: "Jonas K.",
    role: "Lezec",
    text: "Uložil som obľúbené vany a jedným linkom ich poslal parťákom.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Leah W.",
    role: "Fotografka",
    text: "Podpora odpísala do pár minút, keď sa mi posunul termín fotenia. Záchrana.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Omar B.",
    role: "Prvý prenájom",
    text: "Checklist a chat ma udržali v kľude; žiadne prekvapenia ani pri vrátení.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80",
  },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(4);
  const [noTransition, setNoTransition] = React.useState(false);

  React.useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 768) setVisible(2);
      else if (w < 1024) setVisible(3);
      else setVisible(4);
      setIndex(0);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const extended = React.useMemo(() => {
    const extra = testimonials.slice(0, visible);
    return [...testimonials, ...extra];
  }, [visible]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (index === testimonials.length) {
      setNoTransition(true);
      setIndex(0);
      requestAnimationFrame(() => setNoTransition(false));
    }
  }, [index]);

  const gap = 12;
  const basis = `calc((100% - ${(visible - 1) * gap}px)/${visible})`;
  const trackStyle = {
    transform: `translateX(calc(-${index} * (${basis} + ${gap}px)))`,
    transition: noTransition ? "none" : "transform 0.6s ease",
    columnGap: `${gap}px`,
  };

  return (
    <section className="testimonials">
      <div className="test-head">
        <p className="eyebrow">Hlasy z ciest</p>
        <h2>Obľúbené u nájomcov aj hostiteľov</h2>
      </div>
      <div className="test-window">
        <div className="test-track" style={trackStyle}>
          {extended.map((t, idx) => (
            <div
              className="test-card"
              key={`${t.name}-${idx}`}
              style={{ flex: `0 0 ${basis}` }}
            >
              <div className="test-meta">
                <img src={t.avatar} alt={t.name} className="test-avatar" />
                <div>
                  <p className="author">
                    {t.name} <span>• {t.role}</span>
                  </p>
                </div>
              </div>
              <p className="quote">“{t.text}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
