import React from "react"
import { getRenterBookings } from "../api"

export default function Bookings() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getRenterBookings(uid)
        if (active) setItems(data)
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
            <div key={b.id} className="booking-card">
              <div className="booking-head">
                <h3>{b.vanName || "Dodávka"}</h3>
                <span className={`badge status-${b.status || "pending"}`}>
                  {b.status || "pending"}
                </span>
              </div>
              <p className="muted">
                {b.startDate} — {b.endDate}
              </p>
              {b.pickupCity && <p>Prevzatie: {b.pickupCity}</p>}
              {b.totalPrice && <p>Cena: €{b.totalPrice}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
