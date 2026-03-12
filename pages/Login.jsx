import React from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { loginUser } from "../api"

export default function Login() {
    const [loginFormData, setLoginFormData] = React.useState({ email: "", password: "" })
    const [showPw, setShowPw] = React.useState(false)
    const [status, setStatus] = React.useState("idle")
    const [error, setError] = React.useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    const from = location.state?.from || "/host";

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus("submitting")
        setError(null)
        try {
            const data = await loginUser(loginFormData)
            if (data && data.emailVerified === false) {
                setError(new Error("Najprv potvrďte svoj e‑mail. Poslali sme vám overovací link pri registrácii."))
                return
            }
            localStorage.setItem("loggedin", true)
            if (data?.uid) localStorage.setItem("uid", data.uid)
            else if (data?.user?.id) localStorage.setItem("uid", data.user.id)
            const nameFromAuth = data?.name || data?.user?.name
            if (nameFromAuth) {
                localStorage.setItem("name", nameFromAuth)
            } else {
                localStorage.removeItem("name")
            }
            navigate(from, { replace: true })
        } catch (err) {
            setError(err)
        } finally {
            setStatus("idle")
        }
    }

    function handleChange(e) {
        const { name, value } = e.target
        setLoginFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="login-container">
            {
                location.state?.message &&
                    <h3 className="login-error">{location.state.message}</h3>
            }
            <h1>Prihláste sa</h1>
            {
                error?.message &&
                    <h3 className="login-error">{error.message}</h3>
            }

            <form onSubmit={handleSubmit} className="login-form">
                <input
                    name="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="E-mailová adresa"
                    value={loginFormData.email}
                    autoComplete="email"
                />
                <input
                    name="password"
                    onChange={handleChange}
                    type={showPw ? "text" : "password"}
                    placeholder="Heslo"
                    value={loginFormData.password}
                    autoComplete="current-password"
                />
                <label className="pw-toggle">
                    <input
                        type="checkbox"
                        checked={showPw}
                        onChange={(e) => setShowPw(e.target.checked)}
                    />
                    <span>Zobraziť heslo</span>
                </label>
                <button
                    disabled={status === "submitting"}
                >
                    {status === "submitting"
                        ? "Prihlasujem..."
                        : "Prihlásiť sa"
                    }
                </button>
            </form>
            <p className="login-switch">
                Nemáte účet? <Link to="/register">Vytvorte si ho</Link>
            </p>
        </div>
    )

}
