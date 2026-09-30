import { BarDistribution, PredictionChart } from '../components/Charts'
import MetricCard from '../components/MetricCard'
import baseline from '../data/oshaReviewedBaseline.json'

const disposition = baseline.disposition.map((item) => ({ name: item.label, value: item.count }))
const mechanisms = baseline.mechanisms.map((item) => ({ name: item.label, value: item.count }))
const dispositionColors = { 'SIF Potential': '#f18b42', 'Not Apparent': '#2fa89d', Uncertain: '#efc658' }

function labelFor(code) {
  return baseline.disposition.find((item) => item.code === code)?.label || code.replaceAll('_', ' ')
}

function formatDate(value) {
  return new Date(value + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function Dashboard({ onNavigate, analysisHistory = [] }) {
  const baselineActivity = baseline.activity.slice(0, 6)
  return <>
    <div className="page-heading command-hero">
      <div><p className="eyebrow">OIL safety intelligence / command center</p><h1>See the signal before it becomes a pattern.</h1><p>AI-assisted analysis of safety narratives for focused HSE review.</p></div>
      <div className="heading-aside hero-readout"><p className="eyebrow">Baseline</p><strong>Human-reviewed OSHA narratives</strong><span className="metric-foot">{baseline.reviewed_count} reviewed records</span></div>
    </div>
    <div className="metric-grid">
      <MetricCard label="Reviewed reports" value={baseline.reviewed_count} foot="Human-reviewed precursor labels" />
      <MetricCard label="SIF Potential" value={baseline.disposition[0].count} foot="Human-reviewed label count" accent="accent-orange" />
      <MetricCard label="Not Apparent" value={baseline.disposition[1].count} foot="Human-reviewed label count" accent="accent-teal" />
      <MetricCard label="Uncertain" value={baseline.disposition[2].count} foot="Insufficient evidence" accent="accent-yellow" />
    </div>
    <div className="analytics-note baseline-note"><strong>{baseline.source}</strong> These are human-reviewed label counts, not model predictions or observed injury outcomes. {baseline.context}</div>
    <div className="content-grid">
      <section className="panel">
        <div className="panel-header"><div><p className="eyebrow">Activity stream</p><h2>Recent analysis and reviewed reports</h2><p>Model-generated results remain separate from the reviewed baseline.</p></div><button type="button" className="secondary-button" onClick={() => onNavigate('analyze')}>New analysis &#8599;</button></div>
        <div className="panel-body">
          {analysisHistory.length > 0 && <div className="activity-group"><p className="activity-group-label">Recent model analysis</p><div className="recent-list">{analysisHistory.slice(0, 5).map((item) => <div className="recent-row" key={item.id}><div><div className="recent-title">{item.kind === 'bulk' ? 'Bulk analysis row ' + item.rowNumber : 'Individual report analysis'}</div><div className="recent-caption">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Saved analysis result'} ? Model output</div></div><span className={'pill ' + (item.prediction === 'SIF_POTENTIAL' ? 'sif' : 'not')}>{labelFor(item.prediction)}</span><span className="probability">{(item.probability * 100).toFixed(1)}%</span></div>)}</div></div>}
          <div className="activity-group"><p className="activity-group-label">Human-reviewed OSHA records</p><div className="recent-list">{baselineActivity.map((item) => <div className="recent-row" key={item.osha_id}><div><div className="recent-title">{item.event_title}</div><div className="recent-caption">OSHA {item.osha_id} ? {formatDate(item.event_date)} ? Human-reviewed</div></div><span className={'pill ' + (item.label === 'SIF_POTENTIAL' ? 'sif' : item.label === 'NOT_APPARENT' ? 'not' : 'uncertain')}>{labelFor(item.label)}</span><span className="mechanism-caption">{baseline.mechanisms.find((mechanism) => mechanism.code === item.primary_mechanism)?.label || 'Other'}</span></div>)}</div></div>
        </div>
      </section>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Reviewed disposition</p><h2>Human-reviewed labels</h2></div></div><div className="panel-body"><PredictionChart data={disposition} /><div className="chart-legend">{disposition.map((item) => <span key={item.name}><i className="legend-dot" style={{ background: dispositionColors[item.name] }} />{item.name}</span>)}</div></div></section>
    </div>
    <section className="panel" style={{ marginTop: 16 }}><div className="panel-header"><div><p className="eyebrow">Precursor signals</p><h2>Primary mechanism frequency</h2><p>Human-reviewed primary mechanism labels across {baseline.reviewed_count} reports.</p></div></div><div className="panel-body"><div className="chart-wrap tall"><BarDistribution data={mechanisms} color="#2fa89d" /></div></div></section>
  </>
}

export default Dashboard
