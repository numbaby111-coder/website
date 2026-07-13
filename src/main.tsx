import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Signup } from './pages/Signup.tsx'
import { Beta, BetaContributor } from './pages/Beta.tsx'

function Root() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (hash.startsWith('#/signup')) return <Signup />
  // Check the more specific route first — '#/beta-contributor' also starts with '#/beta'.
  if (hash.startsWith('#/beta-contributor')) return <BetaContributor />
  if (hash.startsWith('#/beta')) return <Beta />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
