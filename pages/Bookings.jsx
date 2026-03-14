import React from "react"
import { getRenterBookings } from "../api"

export default function Bookings() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null

  const formatDateTime = (iso) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (isNaN(d)) return "—"
    return d.toLocaleString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getRenterBookings(uid)
        if (active) {
          const sorted = [...data].sort(
            (a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)
          )
          setItems(sorted)
        }
      } catch (err) {
        if (active) setError(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    if (uid) load(); else setLoading(false)
    return () => { active = false }
  }, [uid])

  if (loading) return <h1>Načítavam rezervácie...</h1>
  if (error) return <h3 className="login-error">{error.message}</h3>

  return (
    <main className="account-page">
      <h1>Moje rezervácie</h1>
      {items.length === 0 ? (
        <p className="muted">Zatiaľ nemáte žiadne rezervácie.</p>
      ) : (
        <div className="booking-list">
          {items.map((b) => (
            <div key={b.id} className="booking-card booking-card-grid">
              <div className="booking-meta">
                <p className="muted">Rezervované: {formatDateTime(b.createdAt)}</p>
              </div>
              <div className="booking-van">
                {b.vanImage ? (
                  <img className="van-thumb" src={b.vanImage} alt={b.vanName} />
                ) : null}
                <div>
                  <h3>{b.vanName || "Dodávka"}</h3>
                </div>
              </div>
              <div className="booking-dates">
                <p className="muted">Dátum rezervácie</p>
                <p>Od: <strong>{b.startDate}</strong></p>
                <p>Do: <strong>{b.endDate}</strong></p>
                {b.pickupCity && <p>Prevzatie: {b.pickupCity}</p>}
              </div>
              <div className="booking-price">
                <p className="muted">Celková cena</p>
                {b.totalPrice ? <p>€{b.totalPrice}</p> : <p className="muted">—</p>}
              </div>
              <div className="booking-status">
                <span className={`badge status-${b.status || "pending"}`}>
                  {b.status === "confirmed"
                    ? "Potvrdené"
                    : b.status === "cancelled"
                      ? "Zrušené"
                      : "Čaká na potvrdenie"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
