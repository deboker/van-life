import React from "react"
import { Link, useParams, useLocation, useNavigate } from "react-router-dom"
import { getVan, createBooking, getBookingsForVan } from "../../api"

export default function VanDetail() {
    const [van, setVan] = React.useState(null)
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [booking, setBooking] = React.useState({
        startDate: "",
        endDate: "",
        pickupCity: "",
    })
    const [bookingMsg, setBookingMsg] = React.useState("")
    const [bookingError, setBookingError] = React.useState(null)
    const [bookingLoading, setBookingLoading] = React.useState(false)
    const [existingBookings, setExistingBookings] = React.useState([])
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    React.useEffect(() => {
        async function loadVans() {
            setLoading(true)
            try {
                const data = await getVan(id)
                setVan(data)
                setActiveIndex(0)
                const bookings = await getBookingsForVan(id)
                setExistingBookings(bookings)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        loadVans()
    }, [id])
    
    const search = location.state?.search || "";
    const type = location.state?.type || "všetky";

    const images = van
        ? [van.imageUrl, ...(van.gallery || [])].filter(Boolean)
        : []

    const blockedRanges = React.useMemo(() => {
        const booked = existingBookings
            .filter(b => b.status !== "cancelled")
            .map(b => ({ start: b.startDate, end: b.endDate, label: "rezervované" }))
        const manual = (van?.unavailable || []).map(r => ({ ...r, label: "blokované" }))
        return [...manual, ...booked]
    }, [existingBookings, van])

    if (loading) {
        return <h1>Načítavam...</h1>
    }
    
    if (error) {
        return <h1>Nastala chyba: {error.message}</h1>
    }

    function showNext(delta) {
        setActiveIndex(prev => {
            const next = (prev + delta + images.length) % images.length
            return next
        })
    }
    
    const isLoggedIn = !!localStorage.getItem("loggedin")

    return (
        <div className="van-detail-container">
            <Link
                to={`..${search}`}
                relative="path"
                className="back-button"
            >&larr; <span>Späť na {type} dodávky</span></Link>
            
            {van && (
                <div className="van-detail">
                    {images.length > 0 && (
                        <div className="van-gallery">
                            <div className="van-gallery-main">
                                {images.length > 1 && (
                                    <button
                                        className="gallery-arrow prev"
                                        type="button"
                                        onClick={() => showNext(-1)}
                                        aria-label="Previous image"
                                    >
                                        ‹
                                    </button>
                                )}
                                <img src={images[activeIndex]} alt={van.name} />
                                {images.length > 1 && (
                                    <button
                                        className="gallery-arrow next"
                                        type="button"
                                        onClick={() => showNext(1)}
                                        aria-label="Next image"
                                    >
                                        ›
                                    </button>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="van-gallery-thumbs">
                                    {images.map((src, i) => (
                                        <button
                                            key={src + i}
                                            type="button"
                                            className={`thumb ${i === activeIndex ? "is-active" : ""}`}
                                            onClick={() => setActiveIndex(i)}
                                            aria-label={`Show image ${i + 1}`}
                                        >
                                            <img src={src} alt={`${van.name} ${i + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <i className={`van-type ${van.type} selected`}>
                        {{ simple: "Jednoduché", rugged: "Do terénu", luxury: "Luxusné" }[van.type] || van.type}
                    </i>
                    <h2>{van.name}</h2>
                    <p className="van-price"><span>€{van.price}</span>/deň</p>
                    <p>{van.description}</p>
                    {isLoggedIn ? (
                        <>
                            {blockedRanges.length > 0 && (
                                <div className="blocked-ranges">
                                    <p className="muted">Nedostupné termíny:</p>
                                    <div className="blocked-tags">
                                        {blockedRanges.map((r, idx) => (
                                            <span key={idx} className="badge status-pending">
                                                {r.start} – {r.end} ({r.label})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <form
                                className="booking-form"
                                onSubmit={async (e) => {
                                    e.preventDefault()
                                    setBookingError(null)
                                    setBookingMsg("")
                                    const uid = localStorage.getItem("uid")
                                    const email = localStorage.getItem("email") || van?.renterEmail
                                    if (!uid) {
                                        navigate("/login", { state: { message: "Najprv sa prihláste, aby ste mohli rezervovať." } })
                                        return
                                    }
                                    if (!booking.startDate || !booking.endDate) {
                                        setBookingError(new Error("Vyberte dátumy."))
                                        return
                                    }
                                    const nights = Math.max(
                                        1,
                                        Math.round(
                                            (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
                                        )
                                    )
                                    const totalPrice = nights * (van?.price || 0)
                                    // dostupnosť: blokované intervaly a existujúce rezervácie (okrem cancelled)
                                    const overlaps = (aStart, aEnd, bStart, bEnd) =>
                                        new Date(aStart) <= new Date(bEnd) && new Date(aEnd) >= new Date(bStart)
                                    const conflict = blockedRanges.some((r) =>
                                        overlaps(booking.startDate, booking.endDate, r.start, r.end)
                                    )
                                    if (conflict) {
                                        setBookingError(new Error("Vybrané dátumy nie sú dostupné. Skúste iný termín."))
                                        return
                                    }
                                    try {
                                        setBookingLoading(true)
                                        await createBooking({
                                            vanId: van.id,
                                            vanName: van.name,
                                            vanImage: van.imageUrl,
                                            hostId: van.hostId,
                                            renterId: uid,
                                            renterEmail: email || "",
                                            startDate: booking.startDate,
                                            endDate: booking.endDate,
                                            pickupCity: booking.pickupCity,
                                            totalPrice,
                                        })
                                        setBookingMsg("Rezervácia vytvorená. Hostiteľ vás bude kontaktovať.")
                                        setBooking({ startDate: "", endDate: "", pickupCity: "" })
                                    } catch (err) {
                                        setBookingError(err)
                                    } finally {
                                        setBookingLoading(false)
                                    }
                                }}
                            >
                                <div className="booking-row">
                                    <label>
                                        Od
                                        <input
                                            type="date"
                                            value={booking.startDate}
                                            onChange={(e) => setBooking((p) => ({ ...p, startDate: e.target.value }))}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Do
                                        <input
                                            type="date"
                                            value={booking.endDate}
                                            onChange={(e) => setBooking((p) => ({ ...p, endDate: e.target.value }))}
                                            required
                                        />
                                    </label>
                                </div>
                                <label>
                                    Mesto prevzatia
                                    <input
                                        type="text"
                                        placeholder="Bratislava, Košice…"
                                        value={booking.pickupCity}
                                        onChange={(e) => setBooking((p) => ({ ...p, pickupCity: e.target.value }))}
                                    />
                                </label>
                                {bookingError && <p className="login-error">{bookingError.message}</p>}
                                {bookingMsg && <p className="form-note success">{bookingMsg}</p>}
                                <button className="link-button" type="submit" disabled={bookingLoading}>
                                    {bookingLoading ? "Rezervujem..." : "Rezervovať túto dodávku"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="booking-form">
                            <p>Pre rezerváciu sa prosím prihláste alebo vytvorte účet.</p>
                            <div className="booking-actions">
                                <Link className="pill primary" to="/login">Prihlásiť sa</Link>
                                <Link className="pill ghost" to="/register">Vytvoriť účet</Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
