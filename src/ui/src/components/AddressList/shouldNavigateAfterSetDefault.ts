function asRecord (value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

export function shouldNavigateAfterSetDefault (result: unknown) {
  if (result === false) return false
  const record = asRecord(result)
  if (record?.error) return false
  return true
}

export async function runSetDefaultThenNavigate ({
  setDefault,
  navigate
}: {
  setDefault: () => Promise<unknown>
  navigate: () => void
}) {
  try {
    const result = await setDefault()
    if (!shouldNavigateAfterSetDefault(result)) return false
    navigate()
    return true
  } catch {
    return false
  }
}
