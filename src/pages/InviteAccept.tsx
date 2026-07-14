import { useEffect, useState } from 'react'
import './Signup.css'
import {
  getInvite,
  registerViaInvite,
  acceptInvite,
  loginAccount,
  getMe,
  ApiError,
  type InviteInfo,
  type OrgRole,
} from '../lib/api'
import { getToken, setToken, clearToken } from '../lib/session'

const ROLE_LABELS: Record<OrgRole, string> = {
  org_admin: 'Org Admin',
  expert: 'Expert',
  receptionist: 'Receptionist',
  restaurant_owner: 'Restaurant Owner',
  restaurant_staff: 'Restaurant Staff',
}

type Phase = 'loading' | 'not-found' | 'not-pending' | 'register' | 'login' | 'confirm' | 'success' | 'error'

export function InviteAccept({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Registration form fields
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  // Login form fields
  const [loginPassword, setLoginPassword] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      let info: InviteInfo
      try {
        info = await getInvite(token)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setPhase('not-found')
        } else {
          setError(err instanceof ApiError ? err.message : 'Something went wrong loading this invite.')
          setPhase('error')
        }
        return
      }
      if (cancelled) return
      setInvite(info)

      if (info.status !== 'pending') {
        setPhase('not-pending')
        return
      }
      if (!info.has_account) {
        setPhase('register')
        return
      }

      // has_account: check whether we're already signed in as the invited email.
      const existing = getToken()
      if (!existing) {
        setPhase('login')
        return
      }
      try {
        const me = await getMe(existing)
        if (cancelled) return
        setCurrentEmail(me.email)
        setPhase(me.email.toLowerCase() === info.email.toLowerCase() ? 'confirm' : 'login')
      } catch {
        if (cancelled) return
        clearToken()
        setPhase('login')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const roleLabel = invite ? ROLE_LABELS[invite.role] : ''

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) {
      setError('Please enter your name.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!ageConfirmed) {
      setError('You must confirm you are 18 years or older.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const result = await registerViaInvite(token, {
        password,
        display_name: displayName.trim(),
        age_confirmed: ageConfirmed,
        device_hint: 'web',
      })
      setToken(result.access_token)
      setPhase('success')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const handleLoginThenAccept = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invite) return
    setError('')
    setSubmitting(true)
    try {
      const loginResult = await loginAccount({
        email: invite.email,
        password: loginPassword,
        device_hint: 'web',
      })
      setToken(loginResult.access_token)
      await acceptInvite(token, loginResult.access_token)
      setPhase('success')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const handleConfirmJoin = async () => {
    setError('')
    setSubmitting(true)
    try {
      const sessionToken = getToken()!
      await acceptInvite(token, sessionToken)
      setPhase('success')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const switchAccount = () => {
    clearToken()
    setCurrentEmail(null)
    setPhase('login')
  }

  return (
    <div className="signup-page">
      <a className="signup-back" href="#/">
        &larr; Back to num num theory
      </a>

      <div className="signup-card">
        {phase === 'loading' && <p className="signup-subtitle">Loading invite…</p>}

        {phase === 'not-found' && (
          <>
            <h1 className="signup-title">Invite not found</h1>
            <p className="signup-subtitle">This invite link isn't valid. Double-check the link your org admin sent you.</p>
          </>
        )}

        {phase === 'error' && (
          <>
            <h1 className="signup-title">Something went wrong</h1>
            <p className="signup-subtitle">{error}</p>
          </>
        )}

        {phase === 'not-pending' && invite && (
          <>
            <h1 className="signup-title">
              {invite.status === 'accepted' && 'Invite already accepted'}
              {invite.status === 'revoked' && 'Invite revoked'}
              {invite.status === 'expired' && 'Invite expired'}
            </h1>
            <p className="signup-subtitle">
              {invite.status === 'accepted' &&
                'This invite has already been accepted. If this was you, just sign in.'}
              {invite.status === 'revoked' &&
                'This invite has been revoked by the org admin. Ask them for a new one if this was a mistake.'}
              {invite.status === 'expired' &&
                'This invite has expired. Ask your org admin to send you a new one.'}
            </p>
          </>
        )}

        {phase === 'register' && invite && (
          <>
            <h1 className="signup-title">
              Join {invite.org_name} as {roleLabel}
            </h1>
            <p className="signup-subtitle">Create your account to accept this invite as {invite.email}.</p>

            <form className="signup-form" onSubmit={handleRegister}>
              <label className="field">
                <span>Full name</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <small>At least 8 characters.</small>
              </label>

              <label className="field field-checkbox">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  required
                />
                <span>I confirm I am 18 years of age or older.</span>
              </label>

              {error && <p className="signup-error">{error}</p>}

              <button type="submit" className="signup-submit" disabled={submitting}>
                {submitting ? 'Joining…' : 'Create account & join'}
              </button>
            </form>
          </>
        )}

        {phase === 'login' && invite && (
          <>
            <h1 className="signup-title">
              Join {invite.org_name} as {roleLabel}
            </h1>
            <p className="signup-subtitle">
              An account already exists for {invite.email}. Sign in to accept this invite.
            </p>
            {currentEmail && (
              <p className="signup-subtitle">
                You're currently signed in as {currentEmail}, which doesn't match this invite.
              </p>
            )}

            <form className="signup-form" onSubmit={handleLoginThenAccept}>
              <label className="field">
                <span>Email</span>
                <input type="email" value={invite.email} disabled readOnly />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              {error && <p className="signup-error">{error}</p>}

              <button type="submit" className="signup-submit" disabled={submitting}>
                {submitting ? 'Joining…' : 'Sign in & join'}
              </button>
            </form>
          </>
        )}

        {phase === 'confirm' && invite && (
          <>
            <h1 className="signup-title">
              Join {invite.org_name} as {roleLabel}
            </h1>
            <p className="signup-subtitle">You're signed in as {currentEmail}.</p>

            {error && <p className="signup-error">{error}</p>}

            <button type="button" className="signup-submit" onClick={handleConfirmJoin} disabled={submitting}>
              {submitting ? 'Joining…' : `Join ${invite.org_name}`}
            </button>
            <button
              type="button"
              className="signup-step-back"
              onClick={switchAccount}
              style={{ marginTop: 14 }}
            >
              Not you? Sign in as a different account
            </button>
          </>
        )}

        {phase === 'success' && invite && (
          <>
            <h1 className="signup-title">You're in!</h1>
            <p className="signup-subtitle">
              You've joined {invite.org_name} as {roleLabel}.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
