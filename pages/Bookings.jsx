import React from "react"
import { getRenterBookings, getReviewsByRenter, createReview } from "../api"

export default function Bookings() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [reviewing, setReviewing] = React.useState(null)
  const [reviewDrafts, setReviewDrafts] = React.useState({})
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
        const [data, reviews] = await Promise.all([
          getRenterBookings(uid),
          getReviewsByRenter(uid),
        ])
        const reviewsMap = new Map(reviews.map((r) => [r.bookingId, r]))
        if (active) setReviewDrafts((prev) => prev) // no-op to keep state
        if (active) {
          const sorted = [...data].sort(
            (a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)
          ).map((b) => ({
            ...b,
            reviewed: reviewsMap.has(b.id),
            review: reviewsMap.get(b.id) || null,
          }))
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

  const today = new Date()
  const canReview = (b) =>
    b.status === "confirmed" && new Date(b.endDate) < today && !b.reviewed

  const handleReviewSubmit = async (b) => {
    const draft = reviewDrafts[b.id] || { rating: 5, comment: "" }
    setReviewing(b.id)
    try {
      const res = await createReview({
        bookingId: b.id,
        vanId: b.vanId,
        vanName: b.vanName,
        hostId: b.hostId,
        renterId: uid,
        renterEmail: b.renterEmail,
        rating: draft.rating,
        comment: draft.comment,
      })
      setItems((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, reviewed: true, review: res } : x))
      )
    } catch (err) {
      setError(err)
    } finally {
      setReviewing(null)
    }
  }

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
                {canReview(b) && (
                  <div className="review-form">
                    <label>
                      Hodnotenie
                      <select
                        value={(reviewDrafts[b.id]?.rating) || 5}
                        onChange={(e) =>
                          setReviewDrafts((prev) => ({
                            ...prev,
                            [b.id]: {
                              ...prev[b.id],
                              rating: Number(e.target.value),
                            },
                          }))
                        }
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>{r} ★</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Text recenzie
                      <textarea
                        rows="2"
                        placeholder="Napíšte, čo sa vám páčilo alebo čo zlepšiť"
                        value={reviewDrafts[b.id]?.comment || ""}
                        onChange={(e) =>
                          setReviewDrafts((prev) => ({
                            ...prev,
                            [b.id]: { ...prev[b.id], comment: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <button
                      className="pill primary"
                      disabled={reviewing === b.id}
                      onClick={() => handleReviewSubmit(b)}
                    >
                      {reviewing === b.id ? "Odosielam..." : "Odoslať recenziu"}
                    </button>
                  </div>
                )}
                {b.reviewed && b.review && (
                  <div className="muted" style={{ marginTop: "8px" }}>
                    Vaša recenzia: {b.review.rating}★ – {b.review.comment || "Bez textu"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
