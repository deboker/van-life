import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import CookieBanner from "./CookieBanner"

export default function Layout() {
    const location = useLocation()

    React.useEffect(() => {
        let ticking = false
        let lastState = null
        const threshold = 50
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolledNow = window.scrollY > threshold
                    if (scrolledNow !== lastState) {
                        document.body.classList.toggle("scrolled", scrolledNow)
                        lastState = scrolledNow
                    }
                    ticking = false
                })
                ticking = true
            }
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [location.pathname])

    return (
        <div className="site-wrapper">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <CookieBanner />
        </div>
    )
}
