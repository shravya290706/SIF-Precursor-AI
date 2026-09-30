export const ANALYSIS_HISTORY_KEY = 'sif_recent_analysis_history'
export const MAX_ANALYSIS_HISTORY = 20

function getStorage() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function normalizeEntry(entry) {
  if (!entry || !['single', 'bulk'].includes(entry.kind)) return null
  if (!['SIF_POTENTIAL', 'NOT_APPARENT'].includes(entry.prediction)) return null
  if (!Number.isFinite(entry.probability)) return null

  return {
    id: String(entry.id || ''),
    kind: entry.kind,
    prediction: entry.prediction,
    probability: Math.min(1, Math.max(0, entry.probability)),
    confidence: ['HIGH', 'MEDIUM', 'LOW'].includes(entry.confidence) ? entry.confidence : 'LOW',
    createdAt: String(entry.createdAt || ''),
    rowNumber: Number.isInteger(entry.rowNumber) && entry.rowNumber > 0 ? entry.rowNumber : null,
    evidence: Array.isArray(entry.evidence)
      ? entry.evidence.slice(0, 5).map((item) => String(typeof item === 'string' ? item : item?.term || '').slice(0, 60)).filter(Boolean)
      : [],
  }
}

export function readAnalysisHistory(storage = getStorage()) {
  if (!storage) return []
  try {
    const parsed = JSON.parse(storage.getItem(ANALYSIS_HISTORY_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.map(normalizeEntry).filter(Boolean).slice(0, MAX_ANALYSIS_HISTORY) : []
  } catch {
    return []
  }
}

export function persistAnalysisHistory(entries, storage = getStorage()) {
  const bounded = entries.map(normalizeEntry).filter(Boolean).slice(0, MAX_ANALYSIS_HISTORY)
  if (!storage) return bounded
  try {
    storage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(bounded))
  } catch {
    // Keep the in-memory history available if browser storage is unavailable or full.
  }
  return bounded
}

export function mergeAnalysisHistory(current, incoming, storage = getStorage()) {
  return persistAnalysisHistory([...incoming, ...current], storage)
}

function makeEntry(result, kind, id, createdAt, rowNumber = null) {
  if (!result || !['SIF_POTENTIAL', 'NOT_APPARENT'].includes(result.prediction)) return null
  const probability = Number(result.probability)
  if (!Number.isFinite(probability)) return null
  return normalizeEntry({
    id,
    kind,
    prediction: result.prediction,
    probability,
    confidence: result.confidence,
    evidence: result.evidence,
    createdAt,
    rowNumber,
  })
}

export function createSingleAnalysisEntry(result, now = new Date()) {
  const createdAt = now.toISOString()
  const id = globalThis.crypto?.randomUUID?.() || `single-${now.getTime()}`
  return makeEntry(result, 'single', id, createdAt)
}

export function createBulkAnalysisEntries(result, now = new Date()) {
  const reports = Array.isArray(result?.analyzed_reports) ? result.analyzed_reports : []
  const createdAt = now.toISOString()
  const startIndex = Math.max(0, reports.length - MAX_ANALYSIS_HISTORY)
  return reports.slice(startIndex).reverse().map((report, index) => (
    makeEntry(report, 'bulk', `bulk-${now.getTime()}-${index}`, createdAt, reports.length - index)
  )).filter(Boolean)
}
