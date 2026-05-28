import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage("Submitting...")

    let result

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
      })
    }

    const { data, error } = result

    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }

    setMessage(
      isLogin
        ? "Logged in successfully."
        : "Signup successful. Check your email if confirmation is enabled."
    )
  }

  return (
    <section className="auth-card">
      <h2>{isLogin ? "Log in" : "Create account"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <button type="submit">
          {isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>

      {message && <p>{message}</p>}
    </section>
  )
}

export default AuthForm