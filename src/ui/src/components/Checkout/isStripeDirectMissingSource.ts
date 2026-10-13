function asRecord (value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

export function getPaymethodSourceId (data: unknown): string | null {
  if (typeof data === 'string') {
    try {
      return getPaymethodSourceId(JSON.parse(data))
    } catch {
      return null
    }
  }

  const record = asRecord(data)
  if (!record) return null

  const direct = record.source_id ?? record.id
  if (typeof direct === 'string' && direct) return direct

  return getPaymethodSourceId(record.data)
}

export function isStripeDirectMissingSource ({
  gateway,
  paymethodData,
  cartPaymethodData
}: {
  gateway?: unknown
  paymethodData?: unknown
  cartPaymethodData?: unknown
}) {
  if (gateway !== 'stripe_direct') return false
  return !getPaymethodSourceId(paymethodData) && !getPaymethodSourceId(cartPaymethodData)
}
