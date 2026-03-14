import React from "react"
import { BsStarFill } from "react-icons/bs"
import { getHostReviews } from "../../api"

export default function Reviews() {
  const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const formatDate = (iso) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (isNaN(d)) return "—"
    return d.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getHostReviews(uid)
        if (active) {
          const sorted = [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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

  const last30 = items.filter((r) => {
    const d = new Date(r.createdAt)
    const now = new Date()
    const diff = now - d
    return !isNaN(d) && diff <= 30 * 24 * 60 * 60 * 1000
  })

  const avgRating = (arr) =>
    arr.length
      ? (arr.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / arr.length).toFixed(1)
      : "—"

  if (loading) return <h1>Načítavam recenzie...</h1>
  if (error) return <h3 className="login-error">{error.message}</h3>

  return (
    <section className="host-reviews">
      <div className="top-text">
        <h2>Tvoje recenzie</h2>
        <p>
          Posledných <span>30 dní</span> • {last30.length} recenzií • priemer {avgRating(last30)}
        </p>
      </div>
      <h3>Recenzie ({items.length})</h3>
      {items.length === 0 && <p className="muted">Zatiaľ nemáš žiadne recenzie.</p>}
      {items.map((review) => (
        <div key={review.id}>
          <div className="review">
            {[...Array(Number(review.rating) || 0)].map((_, i) => (
              <BsStarFill className="review-star" key={i} />
            ))}
            <div className="info">
              <p className="name">{review.renterEmail || "Nájomca"}</p>
              <p className="date">{formatDate(review.createdAt)}</p>
            </div>
            <p>{review.comment || "Bez textu"}</p>
          </div>
          <hr />
        </div>
      ))}
    </section>
  )
}
