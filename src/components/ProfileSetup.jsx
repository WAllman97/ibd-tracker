import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

function ProfileSetup({ session, onProfileSaved }) {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setMessage("Saving...")

    const { error } = await supabase
      .from("profiles")
      .insert({
        id: session.user.id,
        username,
      })

    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }

    setMessage("Profile saved.")
    onProfileSaved()
  }

  return (
    <section className="auth-card">
      <h2>Create your profile</h2>
      <p>Choose a username for your account.</p>

      <form onSubmit={handleSaveProfile}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
        />

        <button type="submit">Save profile</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default ProfileSetup