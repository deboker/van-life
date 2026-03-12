import React from "react"
import { useParams, Link, NavLink, Outlet } from "react-router-dom"
import { getVan, deleteVan } from "../../api"

export default function HostVanDetail() {
    const [currentVan, setCurrentVan] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [deleting, setDeleting] = React.useState(false)
    const { id } = useParams()
    const uid = localStorage.getItem("uid") || "123"

    React.useEffect(() => {
        async function loadVans() {
            setLoading(true)
            try {
                const data = await getVan(id)
                setCurrentVan(data)
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

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <section>
            <Link
                to=".."
                relative="path"
                className="back-button"
            >&larr; <span>Späť na všetky dodávky</span></Link>
            {currentVan &&
                <div className="host-van-detail-layout-container">
                    <div className="host-van-detail">
                        <img src={currentVan.imageUrl} />
                        <div className="host-van-detail-info-text">
                            <i
                                className={`van-type van-type-${currentVan.type}`}
                            >
                                {{ simple: "Jednoduché", rugged: "Do terénu", luxury: "Luxusné" }[currentVan.type] || currentVan.type}
                            </i>
                            <h3>{currentVan.name}</h3>
                            <h4>€{currentVan.price}/deň</h4>
                            {currentVan.hostId === uid && (
                                <div className="host-van-actions">
                                    <Link to="edit" className="link-button secondary">Upraviť</Link>
                                    <button
                                        className="link-button danger"
                                        onClick={async () => {
                                            const ok = confirm("Vymazať túto dodávku?");
                                            if (!ok) return;
                                            setDeleting(true);
                                            try {
                                                await deleteVan(id);
                                                window.location.href = "/host/vans";
                                            } catch (err) {
                                                setError(err);
                                            } finally {
                                                setDeleting(false);
                                            }
                                        }}
                                        disabled={deleting}
                                    >
                                        {deleting ? "Mažem..." : "Vymazať"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="host-van-detail-nav">
                        <NavLink
                            to="."
                            end
                            style={({ isActive }) => isActive ? activeStyles : null}
                        >
                            Detaily
                    </NavLink>
                        <NavLink
                            to="pricing"
                            style={({ isActive }) => isActive ? activeStyles : null}
                        >
                            Cenník
                    </NavLink>
                        <NavLink
                            to="photos"
                            style={({ isActive }) => isActive ? activeStyles : null}
                        >
                            Fotky
                    </NavLink>
                    </nav>
                    <Outlet context={{ currentVan }} />
                </div>}
        </section>
    )
}
