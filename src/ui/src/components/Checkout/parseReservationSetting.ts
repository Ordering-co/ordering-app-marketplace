function asSettingObject (value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value
  }
  return {}
}

export function parseReservationSetting (value: unknown) {
  if (typeof value !== 'string') {
    return asSettingObject(value)
  }

  try {
    return asSettingObject(JSON.parse(value))
  } catch {
    return {}
  }
}
