import React from "react";

const testimonials = [
  {
    name: "Mara S.",
    role: "Solo traveler",
    text: "Booked in under 5 minutes and the pickup instructions were crystal clear.",
    avatar: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Diego R.",
    role: "Host · Portland",
    text: "Calendar sync + instant alerts mean I don’t double-book my vans anymore.",
    avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Anika P.",
    role: "Weekend camper",
    text: "Loved the detailed photos; what I saw online is exactly what I got at pickup.",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Caleb H.",
    role: "Remote worker",
    text: "High-roof van, solid solar, and easy handoff. Road office unlocked.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Zoë L.",
    role: "Family of four",
    text: "Filters made it simple to find a kid-friendly layout and car seats ready.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80&sat=20",
  },
  {
    name: "Priya N.",
    role: "Host · Denver",
    text: "Pricing suggestions helped me fill weekdays without discounting weekends.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&h=160&q=80&sat=-10",
  },
  {
    name: "Jonas K.",
    role: "Climber",
    text: "Saved my favorite rigs and shared the list with partners in one link.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Leah W.",
    role: "Photographer",
    text: "Support answered in minutes when my shoot shifted dates. Lifesaver.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Omar B.",
    role: "First-time renter",
    text: "Checklist and chat kept me calm; no surprises at return either.",
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
        <p className="eyebrow">Voices from the road</p>
        <h2>Loved by renters and hosts</h2>
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
