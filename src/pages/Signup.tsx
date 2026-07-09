import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './Signup.css'
import { registerAccount, ApiError, type AccountType } from '../lib/api'

type Step = 'role' | 'form' | 'submitting' | 'success'

const ROLE_INFO: Record<AccountType, { title: string; subtitle: string }> = {
  individual: {
    title: 'Customer',
    subtitle: 'Track meals, get a health score, and build better habits.',
  },
  expert: {
    title: 'Nutrition Expert',
    subtitle: 'Dietitians & nutritionists — manage clients, write prescriptions.',
  },
  restaurant_provider: {
    title: 'Restaurant / Food Business',
    subtitle: 'List your food and reach health-conscious customers.',
  },
}

function PlayStoreBadge({ label = 'Get it on Google Play' }: { label?: string }) {
  return (
    <a className="store-badge" href="#" onClick={(e) => e.preventDefault()}>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
        <path d="M3 2.5c-.3.3-.5.7-.5 1.2v16.6c0 .5.2.9.5 1.2l.1.1L12.6 12v-.1L3.1 2.4z" opacity=".9" />
        <path d="M15.8 15.2 12.6 12l3.2-3.2 4.2 2.4c1.1.6 1.1 1.6 0 2.2z" opacity=".9" />
        <path d="M3.1 2.4l9.5 9.5-9.5 9.5c-.3-.3-.5-.7-.5-1.1V3.5c0-.4.2-.8.5-1.1z" opacity=".6" />
      </svg>
      <span>
        <small>{label.startsWith('Get') ? 'GET IT ON' : 'DOWNLOAD'}</small>
        <strong>{label.startsWith('Get') ? 'Google Play' : label}</strong>
      </span>
      <em className="store-badge-soon">placeholder — app not live yet</em>
    </a>
  )
}

export function Signup() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<AccountType | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [regNumber, setRegNumber] = useState('')
  const [error, setError] = useState('')

  const selectRole = (r: AccountType) => {
    setRole(r)
    setError('')
    setStep('form')
  }

  const regNumberLabel =
    role === 'expert' ? 'Professional registration number' : 'FSSAI license number'
  const regNumberHint =
    role === 'expert'
      ? 'Your dietitian/nutritionist registration number (e.g. IDA).'
      : "Your restaurant's FSSAI license number."

  const validate = (): string => {
    if (!displayName.trim()) return 'Please enter your name.'
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (!ageConfirmed) return 'You must confirm you are 18 years or older.'
    if (role !== 'individual' && !regNumber.trim()) return `Please enter your ${regNumberLabel.toLowerCase()}.`
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setStep('submitting')
    try {
      await registerAccount({
        email: email.trim().toLowerCase(),
        password,
        display_name: displayName.trim(),
        age_confirmed: ageConfirmed,
        account_type: role!,
      })
      setStep('success')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setStep('form')
    }
  }

  return (
    <div className="signup-page">
      <a className="signup-back" href="#/">
        &larr; Back to num num theory
      </a>

      <div className="signup-card">
        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="signup-title">Create your account</h1>
              <p className="signup-subtitle">First, tell us who you are.</p>
              <div className="role-grid">
                {(Object.keys(ROLE_INFO) as AccountType[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className="role-card"
                    onClick={() => selectRole(r)}
                  >
                    <span className="role-card-title">{ROLE_INFO[r].title}</span>
                    <span className="role-card-subtitle">{ROLE_INFO[r].subtitle}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {(step === 'form' || step === 'submitting') && role && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <button type="button" className="signup-step-back" onClick={() => setStep('role')}>
                &larr; Change role
              </button>
              <h1 className="signup-title">{ROLE_INFO[role].title} account</h1>
              <p className="signup-subtitle">{ROLE_INFO[role].subtitle}</p>

              <form className="signup-form" onSubmit={handleSubmit}>
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
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <small>At least 8 characters.</small>
                </label>

                {role !== 'individual' && (
                  <label className="field">
                    <span>{regNumberLabel}</span>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      required
                    />
                    <small>{regNumberHint}</small>
                  </label>
                )}

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

                <button type="submit" className="signup-submit" disabled={step === 'submitting'}>
                  {step === 'submitting' ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && role && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {role === 'individual' ? (
                <>
                  <h1 className="signup-title">You're all set!</h1>
                  <p className="signup-subtitle">
                    Your account has been created. Download the app to start tracking meals and
                    building your health score.
                  </p>
                  <div className="success-actions">
                    <PlayStoreBadge />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="signup-title">Account created — pending verification</h1>
                  <p className="signup-subtitle">
                    Your account is pending verification
                    {role === 'expert'
                      ? ' of your professional registration number.'
                      : " of your restaurant's FSSAI license."}{' '}
                    Once approved, you'll get full access to
                    {role === 'expert' ? ' client and prescription tools.' : ' provider tools.'}
                  </p>
                  <p className="signup-subtitle">
                    You can log in to the web dashboard right away — verified features unlock
                    automatically once approved — or download the {role === 'expert' ? 'expert' : 'provider'} app.
                  </p>
                  <div className="success-actions success-actions-dual">
                    <a className="dashboard-link" href="#" onClick={(e) => e.preventDefault()}>
                      Go to web dashboard
                      <em className="store-badge-soon">placeholder — log in once live</em>
                    </a>
                    <PlayStoreBadge label={`Get the ${role === 'expert' ? 'Expert' : 'Provider'} App`} />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
