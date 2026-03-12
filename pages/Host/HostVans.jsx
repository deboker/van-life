import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { getHostVans } from "../../api"

export default function HostVans() {
    const [vans, setVans] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const navigate = useNavigate()
    const uid = localStorage.getItem("uid") || "123"

    React.useEffect(() => {
        async function loadVans() {
            setLoading(true)
            try {
                const data = await getHostVans(uid)
                setVans(data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        loadVans()
    }, [])

    const hostVansEls = vans.map(van => (
        <Link
            to={van.id}
            key={van.id}
            className="host-van-link-wrapper"
        >
            <div className="host-van-single" key={van.id}>
                <img src={van.imageUrl} alt={`Photo of ${van.name}`} />
                <div className="host-van-info">
                    <h3>{van.name}</h3>
                    <p>€{van.price}/deň</p>
                </div>
            </div>
        </Link>
    ))

    if (loading) {
        return <h1>Načítavam...</h1>
    }

    if (error) {
        return <h1>Nastala chyba: {error.message}</h1>
    }

    return (
        <section>
            <div className="host-vans-header">
                <h1 className="host-vans-title">Tvoje dodávky</h1>
                <button className="pill primary" onClick={() => navigate("/host/vans/new")}>
                    + Pridať dodávku
                </button>
            </div>
            <div className="host-vans-list">
                {
                    vans.length > 0 ? (
                        <section>
                            {hostVansEls}
                        </section>

                    ) : (
                            <h2>Načítavam...</h2>
                        )
                }
            </div>
        </section>
    )
}
