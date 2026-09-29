import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import AnalyzeReport from './pages/AnalyzeReport'
import BulkAnalysis from './pages/BulkAnalysis'
import Analytics from './pages/Analytics'

const navigation = [
  { label: 'Dashboard', key: 'dashboard', index: '01' },
  { label: 'Analyze Report', key: 'analyze', index: '02' },
  { label: 'Bulk Analysis', key: 'bulk', index: '03' },
  { label: 'Analytics', key: 'analytics', index: '04' },
]

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [bulkResult, setBulkResult] = useState(null)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const navigate = (page) => setActivePage(page)
  const page = {
    dashboard: <Dashboard onNavigate={navigate} lastAnalysis={lastAnalysis} />,
    analyze: <AnalyzeReport onAnalysis={setLastAnalysis} />,
    bulk: <BulkAnalysis onResults={setBulkResult} onNavigate={navigate} />,
    analytics: <Analytics bulkResult={bulkResult} />,
  }[activePage]

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-lockup"><div className="brand-mark" aria-hidden="true"><span /><span /><span /></div><div><p className="brand-name">OIL</p><p className="brand-subname">Safety Intelligence</p></div></div>
      <div className="sidebar-rule" /><p className="eyebrow sidebar-label">Workspace</p>
      <nav className="primary-nav" aria-label="Primary navigation">{navigation.map((item) => <button className={`nav-item ${activePage === item.key ? 'is-active' : ''}`} key={item.key} type="button" onClick={() => navigate(item.key)} aria-current={activePage === item.key ? 'page' : undefined}><span className="nav-index">{item.index}</span><span>{item.label}</span>{activePage === item.key && <span className="nav-arrow">↗</span>}</button>)}</nav>
      <div className="sidebar-footer"><div className="system-status"><span className="status-dot" /><div><span className="status-title">Local model online</span><span className="status-caption">FastAPI · TF-IDF baseline</span></div></div><p className="sidebar-note">Decision support for HSE review teams. Not a fatality predictor.</p></div>
    </aside>
    <main className="main-shell">
      <header className="topbar"><div className="topbar-context"><span className="context-kicker">Safety intelligence / 2026</span><span className="context-divider" /><span className="context-current">{navigation.find((item) => item.key === activePage)?.label}</span></div><div className="topbar-meta"><span className="live-indicator"><span className="status-dot" /> Local workspace</span><span className="version-chip">MVP 0.1</span></div></header>
      <div className="page-content">{page}</div>
    </main>
  </div>
}

export default App