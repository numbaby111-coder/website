import { useState } from 'react'
import './Signup.css'
import { loginAccount, ApiError } from '../lib/api'
import { setToken } from '../lib/session'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await loginAccount({
        email: email.trim().toLowerCase(),
        password,
        device_hint: 'web',
      })
      setToken(result.access_token)
      window.location.hash = '#/downloads'
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <a className="signup-back" href="#/">
        &larr; Back to num num theory
      </a>

      <div className="signup-card">
        <h1 className="signup-title">Sign in</h1>
        <p className="signup-subtitle">Sign in to access your downloads.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
