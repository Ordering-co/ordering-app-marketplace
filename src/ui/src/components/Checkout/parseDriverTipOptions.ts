function asOptionsList (value: unknown) {
  if (Array.isArray(value)) return value
  return []
}

export function parseDriverTipOptions (value: unknown) {
  if (typeof value !== 'string') {
    return asOptionsList(value)
  }

  try {
    return asOptionsList(JSON.parse(value))
  } catch {
    return []
  }
}
