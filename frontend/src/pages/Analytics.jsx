import { BarDistribution, PredictionChart, ProbabilityChart } from '../components/Charts'

const emptyData = { prediction: [], probability: [], confidence: [], precursor: [], hasLocation: false, hasActivity: false, locations: [], activities: [] }

function bucketProbability(value) {
  if (value < .2) return '0-20%'
  if (value < .4) return '20-40%'
  if (value < .6) return '40-60%'
  if (value < .8) return '60-80%'
  return '80-100%'
}

function buildData(result) {
  if (!result) return emptyData
  const rows = result.analyzed_reports || []
  const count = (values) => Object.entries(values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})).map(([name, value]) => ({ name, value }))
  const terms = rows.flatMap((row) => row.evidence || []).map((item) => item.term.toLowerCase())
  const precursorTerms = [
    { name: 'Line of fire', terms: ['caught', 'struck', 'between', 'falling'] },
    { name: 'Stored energy', terms: ['pressure', 'hose', 'valve', 'hydraulic'] },
    { name: 'Electrical', terms: ['electric', 'arc'] },
    { name: 'Falls', terms: ['fall'] },
    { name: 'Vehicles', terms: ['vehicle', 'truck'] },
  ]
  const precursor = precursorTerms.map((item) => ({ name: item.name, value: terms.filter((term) => item.terms.some((match) => term.includes(match))).length })).filter((item) => item.value)
  return {
    prediction: count(rows.map((row) => row.prediction)),
    probability: count(rows.map((row) => bucketProbability(row.probability))),
    confidence: count(rows.map((row) => row.confidence)),
    precursor: precursor.length ? precursor : rows.length ? [{ name: 'No mapped terms', value: rows.length }] : [],
    hasLocation: rows.some((row) => row.location),
    hasActivity: rows.some((row) => row.activity),
    locations: count(rows.filter((row) => row.location).map((row) => row.location)),
    activities: count(rows.filter((row) => row.activity).map((row) => row.activity)),
  }
}

function Analytics({ bulkResult }) {
  const data = buildData(bulkResult)
  return <>
    <div className="page-heading">
      <div><p className="eyebrow">Pattern intelligence</p><h1>See recurring signal, not just single events.</h1><p>Explore model outputs and precursor terms from analyzed safety reports.</p></div>
      <div className="heading-aside"><p className="eyebrow">Data view</p><strong>{bulkResult ? 'Uploaded analysis' : 'Awaiting bulk analysis'}</strong></div>
    </div>
    <div className="analytics-note">{bulkResult ? 'Charts below are generated from the uploaded bulk-analysis response.' : 'Upload a CSV in Bulk Analysis to generate analytics from analyzed reports.'}</div>
    <div className="chart-grid" style={{ marginTop: 16 }}>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Disposition</p><h2>SIF vs not apparent</h2></div></div><div className="panel-body"><PredictionChart data={data.prediction} /></div></section>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Probability</p><h2>Probability distribution</h2></div></div><div className="panel-body"><ProbabilityChart data={data.probability} /></div></section>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Certainty</p><h2>Confidence distribution</h2></div></div><div className="panel-body"><BarDistribution data={data.confidence} color="#efc658" /></div></section>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Text signals</p><h2>Precursor categories</h2></div></div><div className="panel-body"><BarDistribution data={data.precursor} color="#2fa89d" /></div></section>
    </div>
    {bulkResult && (data.hasLocation || data.hasActivity) ? <div className="chart-grid" style={{ marginTop: 16 }}>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Context</p><h2>Reports by location</h2></div></div><div className="panel-body"><BarDistribution data={data.locations} /></div></section>
      <section className="panel"><div className="panel-header"><div><p className="eyebrow">Context</p><h2>Reports by activity</h2></div></div><div className="panel-body"><BarDistribution data={data.activities} color="#f18b42" /></div></section>
    </div> : bulkResult && <div className="data-warning">Location and activity analysis requires those columns in the uploaded dataset.</div>}
  </>
}

export default Analytics
