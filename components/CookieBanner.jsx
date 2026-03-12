import React from "react";

export default function CookieBanner() {
  const [open, setOpen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [functional, setFunctional] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("cookieConsent");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOpen(false);
        setFunctional(parsed.functional ?? true);
        setMarketing(parsed.marketing ?? false);
        return;
      } catch (e) {
        // ignore parse error and show banner
      }
    }
    setOpen(true);
  }, []);

  const saveConsent = (opts) => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        functional: opts.functional,
        marketing: opts.marketing,
      })
    );
    setFunctional(opts.functional);
    setMarketing(opts.marketing);
    setOpen(false);
    setShowSettings(false);
  };

  if (!open) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-text">
        <h4>Používame cookies</h4>
        <p>
          Cookies a ďalšie technológie používame na zlepšenie prehliadania, zobrazovanie
          personalizovaného obsahu, analýzu návštevnosti a pochopenie, odkiaľ prichádzajú
          naši návštevníci.
        </p>
      </div>
      <div className="cookie-actions">
        <button
          className="link-button secondary"
          onClick={() =>
            saveConsent({ functional: true, marketing: false })
          }
        >
          Nesúhlasím
        </button>
        <button
          className="link-button"
          onClick={() =>
            saveConsent({ functional: true, marketing: true })
          }
        >
          Súhlasím
        </button>
        <button
          className="link-button ghost"
          onClick={() => setShowSettings((p) => !p)}
        >
          Nastaviť cookies
        </button>
      </div>
      {showSettings && (
        <div className="cookie-settings">
          <div className="cookie-setting">
            <div>
              <h5>Funkčné</h5>
              <p>
                Vždy aktívne. Potrebné pre základné funkcie a bezpečný prenos.
              </p>
            </div>
            <span className="badge">Vždy zapnuté</span>
          </div>
          <div className="cookie-setting">
            <div>
              <h5>Marketing</h5>
              <p>Vytvára profily na reklamu alebo sleduje aktivitu na webe.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) =>
                  setMarketing(e.target.checked)
                }
              />
              <span className="slider-round" />
            </label>
          </div>
          <div className="cookie-settings-actions">
            <button
              className="link-button"
              onClick={() =>
                saveConsent({ functional: true, marketing })
              }
            >
              Uložiť nastavenia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
