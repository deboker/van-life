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
        <h4>We use cookies</h4>
        <p>
          We use cookies and other tracking technologies to improve your browsing
          experience, show personalized content, analyze traffic, and understand
          where our visitors are coming from.
        </p>
      </div>
      <div className="cookie-actions">
        <button
          className="link-button secondary"
          onClick={() =>
            saveConsent({ functional: true, marketing: false })
          }
        >
          I decline
        </button>
        <button
          className="link-button"
          onClick={() =>
            saveConsent({ functional: true, marketing: true })
          }
        >
          I agree
        </button>
        <button
          className="link-button ghost"
          onClick={() => setShowSettings((p) => !p)}
        >
          Change my settings
        </button>
      </div>
      {showSettings && (
        <div className="cookie-settings">
          <div className="cookie-setting">
            <div>
              <h5>Functional</h5>
              <p>
                Always active. Needed to enable core features and secure
                transmission.
              </p>
            </div>
            <span className="badge">Always on</span>
          </div>
          <div className="cookie-setting">
            <div>
              <h5>Marketing</h5>
              <p>
                Used to create profiles for ads or track activity across sites.
              </p>
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
              Save preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
