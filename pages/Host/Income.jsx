import React from "react"
import incomeGraph from "/assets/images/income-graph.png"
import { getHostBookings } from "../../api"
import IncomeChart from "../../components/IncomeChart"

export default function Income() {
    const [bookings, setBookings] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null

    const formatDate = (iso) => {
        if (!iso) return "—"
        const d = new Date(iso)
        if (isNaN(d)) return "—"
        return d.toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    React.useEffect(() => {
        let active = true
        async function load() {
            try {
                const data = await getHostBookings(uid)
                if (!active) return
                setBookings(data)
            } catch (err) {
                if (active) setError(err)
            } finally {
                if (active) setLoading(false)
            }
        }
        if (uid) load(); else setLoading(false)
        return () => { active = false }
    }, [uid])

    const today = new Date()
    const from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last30 = bookings
        .filter(b => b.status !== "cancelled")
        .filter(b => {
            const d = new Date(b.createdAt || b.startDate)
            return d >= from
        })
    const sortedLast30 = [...last30].sort(
        (a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)
    )

    const total = sortedLast30.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)
    const chartData = sortedLast30
        .slice()
        .reverse() // najstarší -> najnovší pre plynulú čiaru
        .map((b) => ({
            label: new Date(b.startDate || b.createdAt).toLocaleDateString("sk-SK", {
                day: "2-digit",
                month: "2-digit",
            }),
            value: Number(b.totalPrice || 0),
        }))

    if (loading) return <h1>Načítavam príjmy...</h1>
    if (error) return <h3 className="login-error">{error.message}</h3>

    return (
        <section className="host-income">
            <h1>Príjmy</h1>
            <p>
                Posledných <span>30 dní</span>
            </p>
            <h2>€{total.toLocaleString("sk-SK")}</h2>
            <div className="graph">
                <IncomeChart data={chartData} />
            </div>
            <div className="info-header">
                <h3>Tvoje transakcie ({sortedLast30.length})</h3>
                <p>
                    Posledných <span>30 dní</span>
                </p>
            </div>
            <div className="transactions">
                {sortedLast30.length === 0 && <p className="muted">Žiadne transakcie v posledných 30 dňoch.</p>}
                {sortedLast30.map((item) => (
                    <div key={item.id} className="transaction">
                        <h3>€{Number(item.totalPrice || 0).toLocaleString("sk-SK")}</h3>
                        <p>{formatDate(item.createdAt || item.startDate)}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
