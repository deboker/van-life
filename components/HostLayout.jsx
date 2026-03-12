import React from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"

export default function HostLayout() {
    const navigate = useNavigate()
    React.useEffect(() => {
        const role = localStorage.getItem("role") || "najomca"
        if (role !== "hostitel") {
            navigate("/account", { replace: true })
        }
    }, [navigate])

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <>
            <div className="host-nav-wrap">
                <nav className="host-nav">
                    <NavLink
                        to="."
                        end
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Prehľad
                    </NavLink>

                    <NavLink
                        to="income"
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Príjmy
                    </NavLink>
                    
                    <NavLink
                        to="vans"
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Dodávky
                    </NavLink>

                    <NavLink
                        to="reviews"
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Recenzie
                    </NavLink>
                </nav>
            </div>
            <Outlet />
        </>
    )
}
