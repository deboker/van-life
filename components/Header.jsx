import React from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import logo from "../assets/images/vanGo_logo.webp"

export default function Header() {
    const [isOpen, setIsOpen] = React.useState(false)
    const location = useLocation()
    const [userName, setUserName] = React.useState(() => localStorage.getItem("name") || "")
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!localStorage.getItem("loggedin"))
    const [role, setRole] = React.useState(() => localStorage.getItem("role") || "najomca")
    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    const closeMenu = () => setIsOpen(false)

    React.useEffect(() => {
        // close mobile nav after any route change
        closeMenu()
        setUserName(localStorage.getItem("name") || "")
        setIsLoggedIn(!!localStorage.getItem("loggedin"))
        setRole(localStorage.getItem("role") || "najomca")
    }, [location.pathname])

    function fakeLogOut() {
        localStorage.removeItem("loggedin")
        localStorage.removeItem("name")
        closeMenu()
        setIsLoggedIn(false)
        setUserName("")
    }

    return (
        <header>
            <Link className="site-logo" to="/">
                <img src={logo} alt="VanGo logo" />
            </Link>
            <button
                className={`burger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Toggle navigation"
                aria-expanded={isOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={`site-nav ${isOpen ? "open" : ""}`}>
                <NavLink
                    to="/"
                    end
                    onClick={closeMenu}
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Domov
                </NavLink>
                {isLoggedIn && role === "hostitel" && (
                    <NavLink
                        to="/host"
                        onClick={closeMenu}
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Host
                    </NavLink>
                )}
                {isLoggedIn && (
                    <NavLink
                        to="/account"
                        onClick={closeMenu}
                        style={({ isActive }) => isActive ? activeStyles : null}
                    >
                        Účet
                    </NavLink>
                )}
                <NavLink
                    to="/about"
                    onClick={closeMenu}
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    O nás
                </NavLink>
                <NavLink
                    to="/vans"
                    onClick={closeMenu}
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Dodávky
                </NavLink>
                {isLoggedIn ? (
                    <>
                        <Link to="/account" className="user-pill" onClick={closeMenu} aria-label="Account">
                            {userName || "You"}
                        </Link>
                        <button className="logout-btn" onClick={fakeLogOut}>Odhlásiť</button>
                    </>
                ) : (
                    <Link to="login" className="login-link" onClick={closeMenu} aria-label="Login">
                        <svg
                            className="login-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 12.5a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                                stroke="#161616"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5 20.4a7 7 0 0 1 14 0"
                                stroke="#161616"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="17.5"
                                cy="6.5"
                                r="1.6"
                                stroke="#ff8c38"
                                strokeWidth="1.6"
                            />
                        </svg>
                    </Link>
                )}
            </nav>
        </header>
    )
}
