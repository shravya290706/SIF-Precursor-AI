import { BarDistribution, PredictionChart } from '../components/Charts'
import MetricCard from '../components/MetricCard'
import { getPriority } from '../services/reviewPriority'

const demoRecent = [
  { id: 'OSHA-2025-10318', title: 'Rotating equipment contact', prediction: 'SIF_POTENTIAL', probability: .91 },
  { id: 'OSHA-2024-07640', title: 'Heat exposure narrative', prediction: 'NOT_APPARENT', probability: .21 },
  { id: 'OSHA-2022-01025', title: 'Suspended load movement', prediction: 'SIF_POTENTIAL', probability: .78 },
]
const demoDistribution = [{ name: 'SIF potential', value: 18 }, { name: 'Not apparent', value: 7 }]
const demoPrecursor = [{ name: 'Line of fire', value: 8 }, { name: 'Caught-in', value: 6 }, { name: 'Stored energy', value: 5 }, { name: 'Falls', value: 4 }, { name: 'Other', value: 2 }]

function countTerms(reports) {
  const groups = [
    { name: 'Line of fire', terms: ['caught', 'struck', 'between', 'falling'] },
    { name: 'Stored energy', terms: ['pressure', 'hose', 'valve', 'hydraulic'] },
    { name: 'Electrical', terms: ['electric', 'arc'] },
    { name: 'Falls', terms: ['fall'] },
    { name: 'Vehicle / mobile', terms: ['vehicle', 'truck'] },
  ]
  const terms = reports.flatMap((report) => report.evidence || []).map((item) => item.term.toLowerCase())
  return groups.map((group) => ({ name: group.name, value: terms.filter((term) => group.terms.some((match) => term.includes(match))).length })).filter((group) => group.value)
}

function Dashboard({ onNavigate, lastAnalysis, bulkResult }) {
  const isLive = Boolean(bulkResult)
  const reports = bulkResult?.analyzed_reports || []
  const recent = isLive ? reports.slice(0, 4).map((report, index) => ({ ...report, id: report.osha_id || `REPORT-${index + 1}`, title: report.event_title || 'Narrative report' })) : demoRecent
  const distribution = isLive ? [{ name: 'SIF potential', value: bulkResult.sif_potential_count }, { name: 'Not apparent', value: bulkResult.not_apparent_count }] : demoDistribution
  const precursor = isLive && countTerms(reports).length ? countTerms(reports) : demoPrecursor
  const sifCount = isLive ? bulkResult.sif_potential_count : 18
  const notCount = isLive ? bulkResult.not_apparent_count : 7
  const total = isLive ? bulkResult.total_reports : 25
  const average = isLive ? `${(bulkResult.average_probability * 100).toFixed(1)}%` : '72.4%'

  return <>
    <div className="page-heading command-hero"><div><p className="eyebrow">OIL safety intelligence / command center</p><h1>See the signal before it becomes a pattern.</h1><p>AI-powered analysis of unsafe-act, unsafe-condition and near-miss narratives for focused HSE review.</p></div><div className="heading-aside hero-readout"><p className="eyebrow">Workspace mode</p><strong>{isLive ? 'Live upload' : 'Local prototype'}</strong><span className="metric-foot">{isLive ? 'Returned from bulk analysis' : 'No persistent database connected'}</span></div></div>
    <div className={`demo-banner ${isLive ? 'live-banner' : ''}`}>{isLive ? 'Live workspace snapshot — metrics below are calculated from the latest CSV response.' : 'Illustrative dashboard view — demo numbers are for interface visualization, not model performance or operational reporting.'}</div>
    <div className="metric-grid"><MetricCard label="Reports analyzed" value={total} foot={isLive ? 'Latest CSV response' : 'Demo workspace snapshot'} demo={!isLive} /><MetricCard label="SIF-potential reports" value={sifCount} foot="Prioritize for HSE review" accent="accent-orange" demo={!isLive} /><MetricCard label="Not apparent" value={notCount} foot="No clear signal" accent="accent-yellow" demo={!isLive} /><MetricCard label="Average SIF probability" value={average} foot={isLive ? 'Model probability average' : 'Illustrative only'} accent="accent-red" demo={!isLive} /></div>
    <div className="content-grid"><section className="panel"><div className="panel-header"><div><p className="eyebrow">Activity stream</p><h2>{isLive ? 'Recent review queue' : 'Recent analysis'}</h2><p>{isLive ? 'Latest rows from the uploaded response' : 'Illustrative reports from a local workspace'}</p></div><button type="button" className="secondary-button" onClick={() => onNavigate('analyze')}>New analysis ↗</button></div><div className="panel-body"><div className="recent-list">{lastAnalysis && <div className="recent-row"><div><div className="recent-title">Latest submitted narrative</div><div className="recent-caption">Live result from Analyze Report</div></div><span className={`pill ${lastAnalysis.prediction === 'SIF_POTENTIAL' ? 'sif' : 'not'}`}>{lastAnalysis.prediction}</span><span className="probability">{(lastAnalysis.probability * 100).toFixed(1)}%</span></div>}{recent.map((item, index) => <div className="recent-row" key={`${item.id}-${index}`}><div><div className="recent-title">{item.title}</div><div className="recent-caption">{item.id}{isLive ? ' · Live result' : ' · Demo record'}</div></div><span className={`pill ${item.prediction === 'SIF_POTENTIAL' ? 'sif' : 'not'}`}>{item.prediction === 'SIF_POTENTIAL' ? 'SIF potential' : 'Not apparent'}</span><span className="probability">{(item.probability * 100).toFixed(1)}%</span></div>)}</div></div></section><section className="panel"><div className="panel-header"><div><p className="eyebrow">Signal mix</p><h2>SIF precursor overview</h2></div></div><div className="panel-body"><PredictionChart data={distribution} /><div className="chart-legend"><span><i className="legend-dot" style={{ background: '#f18b42' }} />SIF potential</span><span><i className="legend-dot" style={{ background: '#2fa89d' }} />Not apparent</span></div></div></section></div>
    <section className="panel" style={{ marginTop: 16 }}><div className="panel-header"><div><p className="eyebrow">Pattern lens</p><h2>Precursor category frequency</h2><p>{isLive ? 'Derived from returned evidence terms' : 'Transparent prototype categorization of the demo view'}</p></div><button type="button" className="secondary-button" onClick={() => onNavigate('analytics')}>View analytics ↗</button></div><div className="panel-body"><div className="chart-wrap tall"><BarDistribution data={precursor} color="#2fa89d" /></div></div></section>
    {isLive && <section className="panel review-queue-panel"><div className="panel-header"><div><p className="eyebrow">Priority lens</p><h2>HSE review queue</h2><p>Prototype review priority based on model probability thresholds.</p></div></div><div className="panel-body queue-grid">{reports.filter((report) => report.prediction === 'SIF_POTENTIAL').slice(0, 4).map((report, index) => <div className="queue-card" key={`${report.osha_id || 'report'}-${index}`}><span className={`priority-badge priority-${getPriority(report.prediction, report.probability).toLowerCase()}`}>{getPriority(report.prediction, report.probability)}</span><strong>{report.osha_id || 'Report'}</strong><span>{(report.probability * 100).toFixed(1)}% model probability</span></div>)}</div></section>}
  </>
}

export default Dashboard