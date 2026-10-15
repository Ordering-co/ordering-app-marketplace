/* global __DEV__ */
import { Platform, Settings } from 'react-native'

export const isLocalSimulatorMode = () => {
  if (!__DEV__ || Platform.OS !== 'ios') return false
  // RCTSettingsManager exports UserDefaults booleans as NSNumber 1 on iOS.
  try {
    const marker = Settings?.get?.('OrderingLocalSimulatorMode')
    return marker === true || marker === 1
  } catch { return false }
}

export const getLocalSimulatorSettings = source => {
  const settings = { ...source, api: { ...source.api }, socket: { ...source.socket } }
  if (!isLocalSimulatorMode()) return settings
  const selected = Settings.get('OrderingLocalSimulatorConfig')
  if (!selected || typeof selected.project !== 'string') return settings
  settings.project = selected.project
  if (selected.api) {
    for (const key of ['url', 'version', 'language']) {
      if (typeof selected.api[key] === 'string') settings.api[key] = selected.api[key]
    }
  }
  if (typeof selected.franchiseSlug === 'string' || (Number.isSafeInteger(selected.franchiseSlug) && selected.franchiseSlug > 0)) settings.franchiseSlug = selected.franchiseSlug
  return settings
}
