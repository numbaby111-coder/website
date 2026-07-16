import { useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import './App.css'
import { TextRotate } from './components/TextRotate'

const taglines = [
  "taste that feels good.",
  "fuel your body right.",
  "eat smart, live well.",
  "nourish every moment.",
  "your health, simplified.",
]

function App() {
  const phoneRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = phoneRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    const rotateY = x * 20
    const rotateX = -y * 15
    el.querySelector<HTMLElement>('.phone-frame')!.style.transform =
      `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = phoneRef.current
    if (!el) return
    el.querySelector<HTMLElement>('.phone-frame')!.style.transform =
      'rotateY(0deg) rotateX(0deg)'
  }, [])

  return (
    <div className="page">
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="logo">
          <svg className="logo-mark" width="44" height="44" viewBox="0 0 100 100">
            <circle cx="50" cy="21" r="9.5" fill="var(--saffron)" />
            <path d="M11 49 L89 49 A39 39 0 0 1 11 49 Z" fill="var(--leaf)" />
          </svg>
          <div className="logo-wordmark">
            <span className="logo-name">num num</span>
            <span className="logo-theory">theory</span>
          </div>
          <span className="beta-tag">BETA</span>
        </div>
        <a className="nav-signup" href="#/signup">
          Sign Up
        </a>
      </motion.nav>

      <section className="hero">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          >
            num num
            <br />
            <span className="hero-title-accent">theory</span>
          </motion.h1>

          <motion.div
            className="hero-tagline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
          >
            <TextRotate
              texts={taglines}
              rotationInterval={3000}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              splitBy="words"
              mainClassName="tagline-rotate"
            />
          </motion.div>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
          >
            <motion.button
              className="cta-button"
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              Learn More &rarr;
            </motion.button>
            <motion.a
              className="download-button"
              href="#/beta"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Get it Now
            </motion.a>
          </motion.div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
          >
            A smart nutrition companion that tracks what you eat, scores your health, and helps you build better food habits — one meal at a time.
          </motion.p>
        </div>

        <motion.div
          className="hero-mockup"
          ref={phoneRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, x: 80, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        >
          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="app-header">
                <div className="app-header-left">
                  <svg width="22" height="22" viewBox="0 0 100 100">
                    <circle cx="50" cy="21" r="9.5" fill="var(--saffron)" />
                    <path d="M11 49 L89 49 A39 39 0 0 1 11 49 Z" fill="var(--leaf)" />
                  </svg>
                  <div>
                    <span className="app-title">num num theory</span>
                    <span className="app-greeting">Hello, User</span>
                  </div>
                </div>
                <div className="app-header-actions">
                  <div className="app-header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  </div>
                  <div className="app-header-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="app-health-card">
                <div className="health-ring">
                  <svg viewBox="0 0 80 80" className="ring-svg">
                    <circle cx="40" cy="40" r="32" className="ring-bg" />
                    <circle cx="40" cy="40" r="32" className="ring-progress" />
                  </svg>
                  <div className="ring-text">
                    <span className="ring-score">72</span>
                    <span className="ring-total">/100</span>
                  </div>
                </div>
                <div className="health-info">
                  <span className="health-label">Health Score</span>
                  <span className="health-status">Good</span>
                  <span className="health-msg">You're on track! Keep logging.</span>
                </div>
              </div>

              <div className="app-section">
                <span className="section-title">Score Breakdown</span>
                <div className="score-row">
                  <span className="score-dot dot-green"></span>
                  <span className="score-name">Consistency</span>
                  <span className="score-val green">78%</span>
                </div>
                <div className="score-bar">
                  <div className="bar-fill bar-green" style={{ width: '78%' }}></div>
                </div>
                <div className="score-row">
                  <span className="score-dot dot-blue"></span>
                  <span className="score-name">Calorie Goals</span>
                  <span className="score-val blue">65%</span>
                </div>
                <div className="score-bar">
                  <div className="bar-fill bar-blue" style={{ width: '65%' }}></div>
                </div>
                <div className="score-row">
                  <span className="score-dot dot-orange"></span>
                  <span className="score-name">Protein Goals</span>
                  <span className="score-val orange">52%</span>
                </div>
                <div className="score-bar">
                  <div className="bar-fill bar-orange" style={{ width: '52%' }}></div>
                </div>
                <div className="score-row">
                  <span className="score-dot dot-purple"></span>
                  <span className="score-name">Mood & Energy</span>
                  <span className="score-val purple">90%</span>
                </div>
                <div className="score-bar">
                  <div className="bar-fill bar-purple" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="app-week">
                <span className="week-title">This Week</span>
                <div className="week-stats">
                  <div className="week-stat">
                    <span className="week-stat-dot dot-green"></span>
                    <span className="week-stat-num">5 / 7</span>
                    <span className="week-stat-label">Days logged</span>
                  </div>
                  <div className="week-stat">
                    <span className="week-stat-dot dot-green"></span>
                    <span className="week-stat-num">3 / 7</span>
                    <span className="week-stat-label">On calorie target</span>
                  </div>
                </div>
                <div className="week-days">
                  <div className="day-circle day-hit"></div>
                  <div className="day-circle day-logged"></div>
                  <div className="day-circle day-logged"></div>
                  <div className="day-circle day-hit"></div>
                  <div className="day-circle day-hit"></div>
                  <div className="day-circle day-empty"></div>
                  <div className="day-circle day-today"></div>
                </div>
                <div className="week-labels">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
              </div>

              <div className="app-nav">
                <div className="nav-item">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>Community</span>
                </div>
                <div className="nav-item">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <span>Home</span>
                </div>
                <div className="nav-fab">
                  <svg width="22" height="22" viewBox="0 0 100 100">
                    <circle cx="50" cy="21" r="9.5" fill="var(--saffron)" />
                    <path d="M11 49 L89 49 A39 39 0 0 1 11 49 Z" fill="#fff" />
                  </svg>
                </div>
                <div className="nav-item">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 3h-8l-2 4h12z"/>
                  </svg>
                  <span>Market</span>
                </div>
                <div className="nav-item nav-active">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span>Progress</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.div
        className="hero-features"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 1.1 }}
      >
        {[
          { icon: <polyline points="20 6 9 17 4 12"/>, label: 'Track Nutrition' },
          { icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>, label: 'Health Scoring', strokeWidth: 2.5 },
          { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>, label: 'Mood Tracking' },
          { icon: <><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>, label: 'AI Diagnostics' },
        ].map((item, i) => (
          <motion.div
            className="feature-item"
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
          >
            <span className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={item.strokeWidth || 2} width="14" height="14">{item.icon}</svg>
            </span>
            {item.label}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default App
