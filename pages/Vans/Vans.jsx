import React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getVans } from "../../api"

export default function Vans() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [vans, setVans] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const typeFilter = searchParams.get("type")
    const sortFilter = searchParams.get("sort")

    React.useEffect(() => {
        async function loadVans() {
            setLoading(true)
            try {
                const data = await getVans()
                setVans(data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        loadVans()
    }, [])

    const filteredVans = typeFilter
        ? vans.filter(van => van.type === typeFilter)
        : vans

    const sortedVans = React.useMemo(() => {
        const clone = [...filteredVans]
        if (sortFilter === "rating") {
            clone.sort((a, b) => (b.avgRating || b.rating || 0) - (a.avgRating || a.rating || 0))
        } else if (sortFilter === "priceAsc") {
            clone.sort((a, b) => (a.price || 0) - (b.price || 0))
        } else if (sortFilter === "priceDesc") {
            clone.sort((a, b) => (b.price || 0) - (a.price || 0))
        }
        return clone
    }, [filteredVans, sortFilter])

    const vanElements = sortedVans.map(van => (
        <div key={van.id} className="van-tile">
            <Link
                to={van.id}
                state={{
                    search: `?${searchParams.toString()}`,
                    type: typeFilter
                }}
            >
                <img src={van.imageUrl} />
                <div className="van-info">
                    <h3>{van.name}</h3>
                    <p>€{van.price}<span>/deň</span></p>
                </div>
                <i className={`van-type ${van.type} selected`}>
                    {{ simple: "Jednoduché", rugged: "Do terénu", luxury: "Luxusné" }[van.type] || van.type}
                </i>
            </Link>
        </div>
    ))

    function handleFilterChange(key, value) {
        setSearchParams(prevParams => {
            if (value === null) {
                prevParams.delete(key)
            } else {
                prevParams.set(key, value)
            }
            return prevParams
        })
    }

    if (loading) {
        return <h1>Načítavam...</h1>
    }
    
    if (error) {
        return <h1>Nastala chyba: {error.message}</h1>
    }

    return (
        <div className="van-list-container">
            <h1>Prezrite si naše dodávky</h1>
            <div className="van-list-filter-buttons">
                <button
                    onClick={() => handleFilterChange("type", "simple")}
                    className={
                        `van-type simple 
                        ${typeFilter === "simple" ? "selected" : ""}`
                    }
                >Jednoduché</button>
                <button
                    onClick={() => handleFilterChange("type", "luxury")}
                    className={
                        `van-type luxury 
                        ${typeFilter === "luxury" ? "selected" : ""}`
                    }
                >Luxusné</button>
                <button
                    onClick={() => handleFilterChange("type", "rugged")}
                    className={
                        `van-type rugged 
                        ${typeFilter === "rugged" ? "selected" : ""}`
                    }
                >Do terénu</button>

                <button
                    onClick={() => handleFilterChange("sort", "rating")}
                    className={`van-type sort ${sortFilter === "rating" ? "selected" : ""}`}
                >
                    Najlepšie hodnotené
                </button>
                <button
                    onClick={() => handleFilterChange("sort", "priceAsc")}
                    className={`van-type sort ${sortFilter === "priceAsc" ? "selected" : ""}`}
                >
                    Cena ↑
                </button>
                <button
                    onClick={() => handleFilterChange("sort", "priceDesc")}
                    className={`van-type sort ${sortFilter === "priceDesc" ? "selected" : ""}`}
                >
                    Cena ↓
                </button>

                {(typeFilter || sortFilter) ? (
                    <button
                        onClick={() => {
                            handleFilterChange("type", null)
                            handleFilterChange("sort", null)
                        }}
                        className="van-type clear-filters"
                    >Zrušiť filtre</button>
                ) : null}

            </div>
            <div className="van-list">
                {vanElements}
            </div>
        </div>
    )
}
