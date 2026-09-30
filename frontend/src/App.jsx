import { useEffect, useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import AnalyzeReport from './pages/AnalyzeReport'
import BulkAnalysis from './pages/BulkAnalysis'
import Analytics from './pages/Analytics'
import LifeSavingRules from './pages/LifeSavingRules'
import Login from './pages/Login'

const AUTH_SESSION_KEY = 'sif_auth_session'
const navigation = [
  { label: 'Dashboard', key: 'dashboard', index: '01' },
  { label: 'Analyze Report', key: 'analyze', index: '02' },
  { label: 'Bulk Analysis', key: 'bulk', index: '03' },
  { label: 'Analytics', key: 'analytics', index: '04' },
  { label: 'Life-Saving Rules', key: 'rules', index: '05' },
]
const routePaths = {
  dashboard: '/dashboard',
  analyze: '/analyze',
  bulk: '/bulk',
  analytics: '/analytics',
  rules: '/life-saving-rules',
}
const routeLookup = {
  '/': 'login',
  '/dashboard': 'dashboard',
  '/analyze': 'analyze',
  '/bulk': 'bulk',
  '/analytics': 'analytics',
  '/life-saving-rules': 'rules',
}

function hasAuthSession() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(AUTH_SESSION_KEY) === 'true' || window.sessionStorage.getItem(AUTH_SESSION_KEY) === 'true'
}

function setAuthSession(value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, String(value))
  window.sessionStorage.setItem(AUTH_SESSION_KEY, String(value))
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasAuthSession())
  const [activePage, setActivePage] = useState(() => (hasAuthSession() ? 'dashboard' : 'login'))
  const [bulkResult, setBulkResult] = useState(null)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const syncCurrentRoute = () => {
      const currentPath = window.location.pathname || '/'

      if (!isAuthenticated && currentPath !== '/') {
        window.history.replaceState({}, '', '/')
        setActivePage('login')
        return
      }

      if (isAuthenticated && currentPath === '/') {
        window.history.replaceState({}, '', '/dashboard')
        setActivePage('dashboard')
        return
      }

      const nextPage = routeLookup[currentPath] || 'dashboard'
      setActivePage(nextPage)
    }

    syncCurrentRoute()
    window.addEventListener('popstate', syncCurrentRoute)
    return () => window.removeEventListener('popstate', syncCurrentRoute)
  }, [isAuthenticated])

  const navigate = (page) => {
    if (!isAuthenticated && page !== 'login') {
      window.history.replaceState({}, '', '/')
      setActivePage('login')
      return
    }

    const nextPath = page === 'login' ? '/' : routePaths[page] || '/dashboard'
    window.history.pushState({}, '', nextPath)
    setActivePage(page)
  }

  const handleLogin = ({ email, password }) => {
    if (email !== 'judge@oil-demo.com' || password !== 'OIL@2026Demo') {
      setLoginError('Invalid credentials. Please use the provided Judge Access credentials.')
      return false
    }

    setAuthSession(true)
    setLoginError('')
    setIsAuthenticated(true)
    window.history.pushState({}, '', '/dashboard')
    setActivePage('dashboard')
    return true
  }

  const handleLogout = () => {
    setAuthSession(false)
    setIsAuthenticated(false)
    setActivePage('login')
    setLoginError('')
    window.history.pushState({}, '', '/')
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} error={loginError} />
  }

  const page = {
    dashboard: <Dashboard onNavigate={navigate} lastAnalysis={lastAnalysis} bulkResult={bulkResult} />,
    analyze: <AnalyzeReport onAnalysis={setLastAnalysis} />,
    bulk: <BulkAnalysis onResults={setBulkResult} onNavigate={navigate} />,
    analytics: <Analytics bulkResult={bulkResult} />,
    rules: <LifeSavingRules currentAnalysis={lastAnalysis} onNavigate={navigate} />,
  }[activePage]

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-lockup"><div className="brand-mark" aria-hidden="true"><span /><span /><span /></div><div><p className="brand-name">OIL</p><p className="brand-subname">Safety Intelligence</p></div></div>
      <div className="sidebar-rule" /><p className="eyebrow sidebar-label">Workspace</p>
      <nav className="primary-nav" aria-label="Primary navigation">{navigation.map((item) => <button className={`nav-item ${activePage === item.key ? 'is-active' : ''}`} key={item.key} type="button" onClick={() => navigate(item.key)} aria-current={activePage === item.key ? 'page' : undefined}><span className="nav-index">{item.index}</span><span>{item.label}</span>{activePage === item.key && <span className="nav-arrow">↗</span>}</button>)}</nav>
      <div className="sidebar-footer"><div className="system-status"><span className="status-dot" /><div><span className="status-title">Safety review workflow</span><span className="status-caption">AI-assisted precursor analysis</span></div></div><p className="sidebar-note">Decision support for HSE review teams. Not a fatality predictor.</p><button type="button" className="logout-button" onClick={handleLogout}>Log out</button></div>
    </aside>
    <main className="main-shell">
      <header className="topbar"><div className="topbar-context"><span className="context-kicker">Safety intelligence / 2026</span><span className="context-divider" /><span className="context-current">{navigation.find((item) => item.key === activePage)?.label}</span></div><div className="topbar-meta"><span className="live-indicator"><span className="status-dot" /> Safety Intelligence Workspace</span><button type="button" className="logout-button header-logout" onClick={handleLogout}>Log out</button></div></header>
      <div className="page-content">{page}</div>
    </main>
  </div>
}

export default App