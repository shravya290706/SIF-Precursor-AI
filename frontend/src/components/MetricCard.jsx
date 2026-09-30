function MetricCard({ label, value, foot, accent = '' }) {
  return <article className={`metric-card ${accent}`}>
    <div className="metric-label"><span>{label}</span></div>
    <div className="metric-value">{value}</div>
    {foot && <div className="metric-foot">{foot}</div>}
  </article>
}

export default MetricCard