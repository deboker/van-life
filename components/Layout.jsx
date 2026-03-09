import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import CookieBanner from "./CookieBanner"

export default function Layout() {
    React.useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 10) {
                document.body.classList.add("scrolled")
            } else {
                document.body.classList.remove("scrolled")
            }
        }
        onScroll()
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

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
