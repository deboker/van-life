import React from "react"
import { Link } from "react-router-dom"
import { BsStarFill } from "react-icons/bs"
import { getHostVans, getHostBookings, getHostReviews } from "../../api"

export default function Dashboard() {
    const [vans, setVans] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [earnings, setEarnings] = React.useState(0)
    const [rating, setRating] = React.useState({ value: "—", count: 0 })
    const uid = localStorage.getItem("uid") || "123"
    const name = localStorage.getItem("name") || "Host"
    React.useEffect(() => {
        let active = true
        async function load() {
            try {
                setLoading(true)
                const [vansData, bookings, reviews] = await Promise.all([
                    getHostVans(uid),
                    getHostBookings(uid),
                    getHostReviews(uid),
                ])
                if (!active) return
                setVans(vansData)

                const now = new Date()
                const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                const earningsSum = bookings
                    .filter(
                        (b) =>
                            b.status === "confirmed" &&
                            new Date(b.createdAt || b.startDate) >= last30 &&
                            new Date(b.createdAt || b.startDate) <= now
                    )
                    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0)
                setEarnings(earningsSum)

                const value =
                    reviews.length > 0
                        ? (
                              reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                              reviews.length
                          ).toFixed(1)
                        : "—"
                setRating({ value, count: reviews.length })
            } catch (err) {
                if (active) setError(err)
            } finally {
                if (active) setLoading(false)
            }
        }
        load()
        return () => {
            active = false
        }
    }, [uid])

    function renderVanElements(vans) {
        const hostVansEls = vans.map((van) => (
            <div className="host-van-single" key={van.id}>
                <img src={van.imageUrl} alt={`Photo of ${van.name}`} />
                <div className="host-van-info">
                    <h3>{van.name}</h3>
                    <p>€{van.price}/deň</p>
                </div>
                <Link to={`vans/${van.id}`}>Detaily</Link>
            </div>
        ))

        return (
            <div className="host-vans-list">
                <section>{hostVansEls}</section>
            </div>
        )
    }

    // if (loading) {
    //     return <h1>Loading...</h1>
    // }

    if (error) {
        return <h1>Chyba: {error.message}</h1>
    }

    return (
        <>
            <section className="host-dashboard-earnings">
                <div className="info">
                    <h1>Vitaj, {name}!</h1>
                    <p>Príjem za <span>posledných 30 dní</span></p>
                    <h2>€{earnings.toLocaleString("sk-SK")}</h2>
                </div>
                <Link to="income">Detaily</Link>
            </section>
            <section className="host-dashboard-reviews">
                <h2>Hodnotenie</h2>

                <BsStarFill className="star" />

                <p>
                    <span>{rating.value}</span>/5
                    {rating.count ? <span style={{ marginLeft: 6, color: "#4d4d4d" }}>({rating.count})</span> : null}
                </p>
                <Link to="reviews">Detaily</Link>
            </section>
            <section className="host-dashboard-vans">
                <div className="top">
                    <h2>Tvoje dodávky</h2>
                    <Link to="vans">Zobraziť všetky</Link>
                </div>
                {
                    loading && !vans
                    ? <h1>Načítavam...</h1>
                    : (
                        <>
                            {renderVanElements(vans)}
                        </>
                    )
                }
                {/*<React.Suspense fallback={<h3>Loading...</h3>}>
                    <Await resolve={loaderData.vans}>{renderVanElements}</Await>
                </React.Suspense>*/}
            </section>
        </>
    )
}
