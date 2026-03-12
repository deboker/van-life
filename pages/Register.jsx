import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState(null);
  const [info, setInfo] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/host";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    setInfo("");
    try {
      const res = await registerUser(form);
      if (res?.emailVerificationSent) {
        setInfo("Poslali sme vám overovací e‑mail. Skontrolujte prosím schránku a po overení sa prihláste.");
        return;
      }
      localStorage.setItem("loggedin", true);
      if (res?.uid) localStorage.setItem("uid", res.uid);
      else if (res?.user?.id) localStorage.setItem("uid", res.user.id);
      if (res?.name || form.name) {
        localStorage.setItem("name", res?.name || form.name);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="login-container">
      <h1>Vytvorte si účet</h1>
      {error?.message && <h3 className="login-error">{error.message}</h3>}
      {info && <p className="login-success">{info}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="name"
          onChange={handleChange}
          type="text"
          placeholder="Celé meno"
          value={form.name}
          required
          autoComplete="name"
        />
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="E-mailová adresa"
          value={form.email}
          required
          autoComplete="email"
        />
        <input
          name="password"
          onChange={handleChange}
          type={showPw ? "text" : "password"}
          placeholder="Heslo (min. 6 znakov)"
          value={form.password}
          required
          autoComplete="new-password"
        />
        <label className="pw-toggle">
          <input
            type="checkbox"
            checked={showPw}
            onChange={(e) => setShowPw(e.target.checked)}
          />
          <span>Show password</span>
        </label>
        <button disabled={status === "submitting"}>
          {status === "submitting" ? "Vytváram..." : "Vytvoriť účet"}
        </button>
      </form>
      <p className="login-switch">
        Už máte účet? <Link to="/login">Prihláste sa</Link>
      </p>
    </div>
  );
}
