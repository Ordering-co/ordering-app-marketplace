export function getPaymethodDataSourceId (paymethodData: unknown) {
  if (typeof paymethodData !== 'string') return null
  try {
    return JSON.parse(paymethodData)?.source_id ?? null
  } catch {
    return null
  }
}
