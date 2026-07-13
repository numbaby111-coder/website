import './Beta.css'

const APK_URL = 'https://api.numnumtheory.com/downloads/numnum-customer.apk'
const APP_VERSION = '0.1.0-beta'

export function Beta() {
  return (
    <div className="beta-page">
      <div className="beta-card">
        <div className="beta-logo">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="21" r="9.5" fill="var(--saffron)" />
            <path d="M11 49 L89 49 A39 39 0 0 1 11 49 Z" fill="var(--leaf)" />
          </svg>
          <span>num num theory</span>
        </div>

        <h1 className="beta-title">Customer app — beta</h1>
        <p className="beta-version">Version {APP_VERSION}</p>
        <p className="beta-subtitle">
          Direct APK download for beta testers. This isn't on Google Play yet — you'll need to
          allow installs from unknown sources on your device.
        </p>

        <a className="beta-download" href={APK_URL}>
          Download APK
        </a>
      </div>
    </div>
  )
}
