import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Signup } from './pages/Signup.tsx'
import { Beta } from './pages/Beta.tsx'
import { SignIn } from './pages/SignIn.tsx'
import { Downloads } from './pages/Downloads.tsx'
import { InviteAccept } from './pages/InviteAccept.tsx'

function Root() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (hash.startsWith('#/signup')) return <Signup />
  if (hash.startsWith('#/signin')) return <SignIn />
  if (hash.startsWith('#/downloads')) return <Downloads />
  if (hash.startsWith('#/invite/')) {
    const token = hash.slice('#/invite/'.length).split('?')[0]
    return <InviteAccept token={token} />
  }
  if (hash.startsWith('#/beta')) return <Beta />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
