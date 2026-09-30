function PrecursorCard({ name, code }) {
  return <div className="precursor-card"><span className="precursor-icon">{code}</span><div><strong>{name}</strong><span>Matched rule signal</span></div></div>
}

export default PrecursorCard