import { useState } from 'react'

function Login({ onLogin, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const useJudgeCredentials = () => {
    setEmail('judge@oil-demo.com')
    setPassword('OIL@2026Demo')
  }

  const submit = (event) => {
    event.preventDefault()
    onLogin({ email: email.trim(), password })
  }

  return <main className="login-shell">
    <section className="login-hero" aria-labelledby="login-brand">
      <div className="brand-lockup"><div className="brand-mark" aria-hidden="true"><span /><span /><span /></div><div><p className="brand-name">OIL</p><p className="brand-subname">Safety Intelligence</p></div></div>
      <div className="login-hero-copy"><p className="eyebrow">SIF Precursor AI</p><h1 id="login-brand">Safety intelligence before risk becomes a pattern.</h1><p>AI-assisted analysis of safety narratives to identify Serious Injury &amp; Fatality precursor signals, critical hazards, and recurring safety patterns.</p></div>
      <div className="login-hero-footer"><span className="status-dot" /> HSE decision support · Not a fatality prediction</div>
    </section>
    <section className="login-panel-wrap">
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">Safety Intelligence</p><h2>Sign in to Safety Intelligence</h2><p className="login-intro">Access report analysis, review priorities, and safety patterns.</p>
        <label htmlFor="login-email">Email</label><input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="error-message" role="alert">{error}</p>}
        <button className="primary-button login-submit" type="submit">Sign In</button>
        <div className="judge-access"><div><p className="eyebrow">Judge Access</p><p className="judge-credential"><span>Email</span><strong>judge@oil-demo.com</strong></p><p className="judge-credential"><span>Password</span><strong>OIL@2026Demo</strong></p></div><button type="button" className="secondary-button" onClick={useJudgeCredentials}>Use Judge Credentials</button></div>
      </form>
    </section>
  </main>
}

export default Login
