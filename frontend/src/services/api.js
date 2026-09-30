const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
async function parseResponse(response) { const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.detail || 'The analysis service returned an error.'); return payload }
export async function healthCheck() { return parseResponse(await fetch(`${API_BASE}/health`)) }
export async function analyzeReport(narrative) { return parseResponse(await fetch(`${API_BASE}/api/analyze`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ narrative }) })) }
export async function analyzeBulk(file) { const data=new FormData(); data.append('file',file); return parseResponse(await fetch(`${API_BASE}/api/analyze/bulk`,{method:'POST',body:data})) }