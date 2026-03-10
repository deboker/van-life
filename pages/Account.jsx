import React from "react"
import { getUserProfile, updateUserProfile, changePassword } from "../api"

export default function Account() {
  const [profile, setProfile] = React.useState({ name: "", email: "" })
  const [loadingProfile, setLoadingProfile] = React.useState(true)
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [pwStatus, setPwStatus] = React.useState("idle")
  const [pwError, setPwError] = React.useState(null)
  const [profileMsg, setProfileMsg] = React.useState(null)
  const [pwMsg, setPwMsg] = React.useState(null)

  const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getUserProfile(uid)
        if (!active) return
        setProfile({ name: data?.name || "", email: data?.email || "" })
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoadingProfile(false)
      }
    }
    if (uid) load()
    return () => { active = false }
  }, [uid])

  function handleProfileChange(e) {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg(null)
    try {
      await updateUserProfile(uid, { name: profile.name })
      localStorage.setItem("name", profile.name)
      setProfileMsg("Profile updated")
    } catch (err) {
      console.error(err)
      setProfileMsg(err.message || "Could not update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwStatus("submitting")
    setPwError(null)
    setPwMsg(null)
    const currentPassword = e.target.currentPassword.value
    const newPassword = e.target.newPassword.value
    const confirmPassword = e.target.confirmPassword.value
    if (newPassword !== confirmPassword) {
      setPwStatus("idle")
      setPwError(new Error("New passwords do not match"))
      return
    }
    try {
      await changePassword(currentPassword, newPassword)
      setPwMsg("Password updated")
      e.target.reset()
    } catch (err) {
      console.error(err)
      setPwError(err)
    } finally {
      setPwStatus("idle")
    }
  }

  return (
    <main className="account-page">
      <h1>Your account</h1>
      <div className="account-grid">
        <section className="account-card">
          <div className="card-head">
            <h2>Profile</h2>
            {loadingProfile && <span className="muted">Loading…</span>}
          </div>
          <form className="account-form" onSubmit={handleSaveProfile}>
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                value={profile.name}
                onChange={handleProfileChange}
                required
                autoComplete="name"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={profile.email}
                readOnly
                disabled
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving…" : "Save changes"}
              </button>
              {profileMsg && <p className="form-note">{profileMsg}</p>}
            </div>
          </form>
        </section>

        <section className="account-card">
          <div className="card-head">
            <h2>Security</h2>
          </div>
          <form className="account-form" onSubmit={handleChangePassword}>
            <label>
              <span>Current password</span>
              <input name="currentPassword" type="password" required autoComplete="current-password" />
            </label>
            <label>
              <span>New password</span>
              <input name="newPassword" type="password" required minLength={6} autoComplete="new-password" />
            </label>
            <label>
              <span>Confirm new password</span>
              <input name="confirmPassword" type="password" required minLength={6} autoComplete="new-password" />
            </label>
            {pwError && <p className="login-error">{pwError.message}</p>}
            {pwMsg && <p className="form-note success">{pwMsg}</p>}
            <div className="form-actions">
              <button type="submit" disabled={pwStatus === "submitting"}>
                {pwStatus === "submitting" ? "Updating…" : "Change password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
