import { lifeSavingRules, mapLifeSavingRules } from '../data/lifeSavingRules'
import RuleBadge from '../components/RuleBadge'

function LifeSavingRules({ currentAnalysis, onNavigate }) {
  const mapped = currentAnalysis?.narrative ? mapLifeSavingRules(currentAnalysis.narrative) : []
  return <>
    <div className="page-heading"><div><p className="eyebrow">Rule intelligence</p><h1>Make the rule connection visible.</h1><p>Review the vocabulary layer that maps narrative signals to relevant Life-Saving Rule categories.</p></div><div className="heading-aside"><p className="eyebrow">Method</p><strong>Deterministic rule mapping</strong><span className="metric-foot">Separate from the trained classifier</span></div></div>
    <div className="rule-callout"><span className="status-dot" /><div><strong>Rule mapping</strong><p>These matches link narrative terms to relevant Life-Saving Rule categories for HSE review context.</p></div></div>
    {currentAnalysis && <section className="panel rule-context"><div className="panel-header"><div><p className="eyebrow">Current analysis context</p><h2>Latest submitted narrative</h2></div><button type="button" className="secondary-button" onClick={() => onNavigate('analyze')}>Open analysis ↗</button></div><div className="panel-body"><p className="context-quote">“{currentAnalysis.narrative}”</p><div className="rule-list">{mapped.length ? mapped.map((rule) => <RuleBadge key={rule.id} name={rule.name} />) : <span className="empty-evidence">No rule match.</span>}</div></div></section>}
    <div className="rules-grid">{lifeSavingRules.map((rule, index) => <article className="rule-card" key={rule.id}><div className="rule-card-top"><span className="rule-number">0{index + 1}</span><span className="rule-status">Rule category</span></div><h2>{rule.name}</h2><p>Mapped when the narrative contains signals associated with this category.</p><div className="term-cloud">{rule.terms.slice(0, 5).map((term) => <span key={term}>{term}</span>)}</div></article>)}</div>
  </>
}

export default LifeSavingRules