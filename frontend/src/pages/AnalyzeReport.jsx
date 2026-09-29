import { useState } from 'react'
import { mapLifeSavingRules } from '../data/lifeSavingRules'
import { mapPrecursors } from '../services/precursorMapper'
import { analyzeReport } from '../services/api'
import { mapControlSignals } from '../services/controlMapper'
import EvidenceTags from '../components/EvidenceTags'
import PrecursorCard from '../components/PrecursorCard'
import RiskCard from '../components/RiskCard'
import RuleBadge from '../components/RuleBadge'

function highlightNarrative(narrative, evidence) {
  if (!evidence?.length) return narrative
  const terms = evidence.map((item) => item.term).filter(Boolean).sort((a, b) => b.length - a.length)
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const matcher = new RegExp(`(${escaped.join('|')})`, 'gi')
  return narrative.split(matcher).map((part, index) => terms.some((term) => term.toLowerCase() === part.toLowerCase()) ? <mark key={`${part}-${index}`}>{part}</mark> : part)
}

function AnalyzeReport({ onAnalysis }) {
  const [narrative, setNarrative] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) { event.preventDefault(); if (!narrative.trim()) { setError('Enter a safety report narrative before analyzing.'); return } setLoading(true); setError(''); try { const next = await analyzeReport(narrative); setResult(next); onAnalysis({ ...next, narrative }) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  const precursors = result ? mapPrecursors(narrative, result.evidence) : []
  const rules = result ? mapLifeSavingRules(narrative) : []
  const controls = result ? mapControlSignals(narrative) : []
  return <>
    <div className="page-heading command-hero"><div><p className="eyebrow">Individual report analysis / live triage</p><h1>Put one narrative under the lens.</h1><p>Follow the signal from a submitted report to evidence, precursor, rule, barrier and HSE review priority.</p></div><div className="heading-aside hero-readout"><p className="eyebrow">Decision support</p><strong>Human review stays in the loop</strong><span className="metric-foot">Local model · explainable output</span></div></div>
    <div className="analysis-layout">
      <section className="analysis-hero"><p className="eyebrow">Narrative triage / 01</p><h1>Find the precursor signal.</h1><p>Detect SIF precursor potential, surface text evidence, and focus the next HSE review conversation.</p><form className="analysis-form" onSubmit={submit}><label htmlFor="narrative">Safety report narrative</label><textarea id="narrative" value={narrative} onChange={(event) => setNarrative(event.target.value)} placeholder="Enter safety report narrative..."/><div className="button-row"><span className="form-hint">Local TF-IDF model · No report is stored by this interface</span><button className="primary-button" type="submit" disabled={loading}>{loading ? 'Analyzing…' : 'Analyze Report ↗'}</button></div>{error && <div className="error-message" role="alert">{error}</div>}</form></section>
      <div className="result-stack">{result ? <><div className="analysis-flow" aria-label="Analysis path"><span>REPORT</span><i>→</i><span>SIF SIGNAL</span><i>→</i><span>EVIDENCE</span><i>→</i><span>REVIEW</span></div><RiskCard result={result}/><section className="narrative-evidence-panel"><div className="section-kicker">Evidence trace / original narrative</div><p>{highlightNarrative(narrative, result.evidence)}</p><span className="evidence-source">Highlighted text comes directly from the submitted report.</span></section><section className="mini-panel"><h3>Detected SIF precursor indicators</h3><EvidenceTags evidence={result.evidence}/><p className="rule-note">Evidence terms above are returned from the submitted narrative by the local classifier.</p></section><section className="mini-panel"><h3>Precursor categories</h3><div className="precursor-list">{precursors.length ? precursors.map((item) => <PrecursorCard key={item.code} {...item}/>) : <p className="empty-evidence">No transparent prototype rule match.</p>}</div></section><section className="mini-panel"><h3>Barrier / control signals</h3><div className="control-list">{controls.map((control) => <div className={`control-row control-${control.status.toLowerCase()}`} key={control.name}><div><strong>{control.name}</strong><span>{control.detail}</span></div><b>{control.status}</b></div>)}</div><p className="rule-note">UI-level prototype mapping. Verify controls against the original report during HSE review.</p></section><section className="mini-panel"><h3>Life-Saving Rules</h3><div className="rule-list">{rules.length ? rules.map((rule) => <RuleBadge key={rule.id} name={rule.name}/>) : <span className="empty-evidence">No rule match from narrative terms.</span>}</div><p className="rule-note">Rule mapping — prototype. This deterministic layer is separate from the trained classifier and is not an official OIL ranking.</p></section></> : <section className="mini-panel empty-result"><p className="eyebrow">Awaiting narrative</p><h2>Your analysis will appear here.</h2><p className="empty-evidence">The result will include model probability, confidence, evidence terms, precursor categories, prototype rule matches, and barrier signals.</p></section>}</div>
    </div>
  </>
}

export default AnalyzeReport