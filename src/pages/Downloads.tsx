import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './Downloads.css'
import { getMe, ApiError, type MeResponse } from '../lib/api'
import { getToken, clearToken } from '../lib/session'

type LoadState = 'loading' | 'ready' | 'error'

const EXPERT_APK_URL = 'https://api.numnumtheory.com/downloads/numnum-expert.apk'
const CONTRIBUTOR_APK_URL = 'https://api.numnumtheory.com/downloads/numnum-contributor.apk'
const EXPERT_WEBAPP_URL = 'https://expert.numnumtheory.com'

export function Downloads() {
  const [state, setState] = useState<LoadState>('loading')
  const [me, setMe] = useState<MeResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      window.location.hash = '#/signin'
      return
    }
    getMe(token)
      .then((data) => {
        setMe(data)
        setState('ready')
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearToken()
          window.location.hash = '#/signin'
          return
        }
        setError(err instanceof ApiError ? err.message : 'Something went wrong loading your account.')
        setState('error')
      })
  }, [])

  if (state === 'loading') {
    return (
      <div className="downloads-page">
        <div className="downloads-card">
          <p className="downloads-subtitle">Loading your account…</p>
        </div>
      </div>
    )
  }

  if (state === 'error' || !me) {
    return (
      <div className="downloads-page">
        <div className="downloads-card">
          <h1 className="downloads-title">Downloads</h1>
          <p className="downloads-error">{error || 'Something went wrong.'}</p>
        </div>
      </div>
    )
  }

  const sections: ReactNode[] = []

  if (me.is_expert) {
    if (me.verification_status === 'verified') {
      sections.push(
        <div className="downloads-section" key="expert">
          <h2 className="downloads-section-title">Expert app</h2>
          <div className="downloads-row">
            <a className="downloads-button" href={EXPERT_APK_URL}>
              Download Expert APK
            </a>
            <a
              className="downloads-link-secondary"
              href={EXPERT_WEBAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Web Dashboard
            </a>
          </div>
        </div>,
      )
    } else if (me.verification_status === 'rejected') {
      sections.push(
        <div className="downloads-section" key="expert">
          <h2 className="downloads-section-title">Expert app</h2>
          <p className="downloads-subtitle">
            Your expert account verification wasn't approved. If you believe this is a mistake,
            please contact support.
          </p>
        </div>,
      )
    } else {
      // Covers 'pending', and defensively any legacy is_expert=true row with no org yet.
      sections.push(
        <div className="downloads-section" key="expert">
          <h2 className="downloads-section-title">Expert app</h2>
          <p className="downloads-subtitle">
            Your account is still under review. We'll notify you once approved.
          </p>
        </div>,
      )
    }
  }

  if (me.org_type === 'restaurant_provider') {
    sections.push(
      <div className="downloads-section" key="restaurant">
        <h2 className="downloads-section-title">Restaurant / Provider app</h2>
        <p className="downloads-subtitle">
          The Restaurant/Provider app is still in development. Check back soon.
        </p>
      </div>,
    )
  }

  if (me.contributor_interest) {
    sections.push(
      <div className="downloads-section" key="contributor">
        <h2 className="downloads-section-title">Contributor app</h2>
        <a className="downloads-button" href={CONTRIBUTOR_APK_URL}>
          Download Contributor APK
        </a>
      </div>,
    )
  }

  if (sections.length === 0) {
    sections.push(
      <div className="downloads-section" key="none">
        <h2 className="downloads-section-title">Customer app</h2>
        <p className="downloads-subtitle">
          Looking for the Customer app? Visit our <a href="#/beta">beta download page</a>.
        </p>
      </div>,
    )
  }

  return (
    <div className="downloads-page">
      <div className="downloads-card">
        <h1 className="downloads-title">Downloads</h1>
        <p className="downloads-greeting">Signed in as {me.email}</p>
        {sections}
      </div>
    </div>
  )
}
