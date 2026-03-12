import React from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import { getVan } from "../../api"

export default function VanDetail() {
    const [van, setVan] = React.useState(null)
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const { id } = useParams()
    const location = useLocation()

    React.useEffect(() => {
        async function loadVans() {
            setLoading(true)
            try {
                const data = await getVan(id)
                setVan(data)
                setActiveIndex(0)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        loadVans()
    }, [id])
    
    if (loading) {
        return <h1>Načítavam...</h1>
    }
    
    if (error) {
        return <h1>Nastala chyba: {error.message}</h1>
    }

    const search = location.state?.search || "";
    const type = location.state?.type || "všetky";

    const images = van
        ? [van.imageUrl, ...(van.gallery || [])].filter(Boolean)
        : []

    function showNext(delta) {
        setActiveIndex(prev => {
            const next = (prev + delta + images.length) % images.length
            return next
        })
    }
    
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
                    <button className="link-button">Prenajať túto dodávku</button>
                </div>
            )}
        </div>
    )
}
