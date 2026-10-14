/* global __DEV__ */
import source from './config.json'
import { getLocalSimulatorSettings, isLocalSimulatorMode } from './onboarding/ios-local-mode'
import { shouldRunProjectSetup } from './onboarding/tenant'

// Configured development onboarding pins the selected public tenant.
// Release preserves source flags and the historical root-point/project flow.
const settings = { ...getLocalSimulatorSettings(source), localSimulatorMode: isLocalSimulatorMode() }
if (shouldRunProjectSetup(settings, { isDev: __DEV__, localSimulator: settings.localSimulatorMode })) settings.use_root_point = false
const keysToNull = ['franchiseSlug', 'businessSlug']
keysToNull.forEach(key => { if (settings[key] === '0') settings[key] = null })

export const selectedProjectSettings = { ...settings, api: { ...settings.api }, socket: { ...settings.socket } }

// Older SDK/native UI fields are named franchiseSlug but filter franchise_id.
// Resolve the explicitly chosen public slug to its numeric ID before mounting.
export const setRuntimeFranchise = id => { settings.franchiseSlug = id }

export default settings
