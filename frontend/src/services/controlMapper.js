const controlSignals = [
  { name: 'Energy isolation', terms: ['lockout', 'tagout', 'isolat', 'de-energ', 'bleed', 'pressure'] },
  { name: 'Exclusion zone / positioning', terms: ['line of fire', 'between', 'clear of', 'barricade', 'exclusion', 'standing'] },
  { name: 'Guarding / interlock', terms: ['guard', 'interlock', 'machine', 'rotating', 'pinch'] },
  { name: 'Fall protection', terms: ['harness', 'sr l', 'srl', 'fall protection', 'ladder', 'scaffold', 'elevated'] },
  { name: 'Atmospheric control', terms: ['gas test', 'h2s', 'hydrogen sulfide', 'oxygen', 'ventilat', 'confined'] },
]

export function mapControlSignals(narrative) {
  const text = narrative.toLowerCase()
  const matches = controlSignals.filter((signal) => signal.terms.some((term) => text.includes(term)))
  if (!matches.length) return [{ name: 'Control detail not stated', status: 'REVIEW', detail: 'No explicit barrier language in the submitted narrative.' }]
  return matches.map((signal) => ({
    ...signal,
    status: /failed|broke|broken|not followed|not used|missing|left open|unexpected/.test(text) ? 'DEGRADED' : 'SIGNAL',
    detail: /failed|broke|broken|not followed|not used|missing|left open|unexpected/.test(text) ? 'Narrative contains a possible control concern.' : 'Narrative contains related control language.',
  }))
}