export function getPriority(prediction, probability) {
  if (prediction === 'SIF_POTENTIAL' && probability >= 0.8) return 'HIGH'
  if (prediction === 'SIF_POTENTIAL' && probability >= 0.6) return 'MEDIUM'
  return 'LOW'
}