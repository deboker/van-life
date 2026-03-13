import React from "react"
import { Link } from "react-router-dom"
import { BsStarFill } from "react-icons/bs"
import { getHostVans } from "../../api"

export default function Dashboard() {
    const [vans, setVans] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const uid = localStorage.getItem("uid") || "123"
    const name = localStorage.getItem("name") || "Host"
    React.useEffect(() => {
        setLoading(true)
        getHostVans(uid)
            .then(data => setVans(data))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [])

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
                    <h2>€2,260</h2>
                </div>
                <Link to="income">Detaily</Link>
            </section>
            <section className="host-dashboard-reviews">
                <h2>Hodnotenie</h2>

                <BsStarFill className="star" />

                <p>
                    <span>5.0</span>/5
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
