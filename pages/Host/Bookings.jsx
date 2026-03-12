import React from "react"
import { getHostBookings, updateBookingStatus } from "../../api"

export default function HostBookings() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [savingId, setSavingId] = React.useState(null)
  const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getHostBookings(uid)
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
    <section>
      <h1>Rezervácie mojich dodávok</h1>
      {items.length === 0 ? (
        <p className="muted">Zatiaľ nemáte žiadne rezervácie na svojich dodávkach.</p>
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
              {b.renterEmail && <p>Nájomca: {b.renterEmail}</p>}
              {b.pickupCity && <p>Prevzatie: {b.pickupCity}</p>}
              {b.totalPrice && <p>Cena: €{b.totalPrice}</p>}
              <div className="booking-actions">
                <button
                  className="pill primary"
                  disabled={savingId === b.id}
                  onClick={async () => {
                    setSavingId(b.id)
                    try {
                      await updateBookingStatus(b.id, "confirmed")
                      setItems((prev) =>
                        prev.map((x) => (x.id === b.id ? { ...x, status: "confirmed" } : x))
                      )
                    } catch (err) {
                      setError(err)
                    } finally {
                      setSavingId(null)
                    }
                  }}
                >
                  Potvrdiť
                </button>
                <button
                  className="pill danger"
                  disabled={savingId === b.id}
                  onClick={async () => {
                    setSavingId(b.id)
                    try {
                      await updateBookingStatus(b.id, "cancelled")
                      setItems((prev) =>
                        prev.map((x) => (x.id === b.id ? { ...x, status: "cancelled" } : x))
                      )
                    } catch (err) {
                      setError(err)
                    } finally {
                      setSavingId(null)
                    }
                  }}
                >
                  Zrušiť
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
