const mockSource = { localProjectConfigured: true, project: 'configured_project', use_root_point: true, franchiseSlug: 34, businessSlug: null, merchantId: 'keep-native-id', api: { url: 'https://api.example.test', version: 'v400', language: 'en' }, socket: { url: 'https://socket.example.test' } }
jest.mock('../../config.json', () => mockSource)
jest.mock('../ios-local-mode', () => ({ isLocalSimulatorMode: () => false, getLocalSimulatorSettings: source => ({ ...source, api: { ...source.api }, socket: { ...source.socket } }) }))
const initialDev = global.__DEV__
afterEach(() => { global.__DEV__ = initialDev; mockSource.localProjectConfigured = true })

it('preserves original Release root-point flags and legacy native franchise IDs', () => {
  global.__DEV__ = false
  jest.isolateModules(() => {
    const settings = require('../../config').default
    expect(settings.use_root_point).toBe(true)
    expect(settings.franchiseSlug).toBe(34)
    expect(settings.merchantId).toBe('keep-native-id')
    expect(settings.api).toEqual(mockSource.api)
    expect(settings.socket).toEqual(mockSource.socket)
  })
})
it('pins only a configured development project while preserving the source object', () => {
  global.__DEV__ = true
  jest.isolateModules(() => {
    const settings = require('../../config').default
    expect(settings.use_root_point).toBe(false)
    expect(settings.franchiseSlug).toBe(34)
    expect(mockSource.use_root_point).toBe(true)
    expect(mockSource.project).toBe('configured_project')
  })
})


it('preserves the historical DEV project and flags when setup was never explicitly enabled', () => {
  global.__DEV__ = true
  delete mockSource.localProjectConfigured
  jest.isolateModules(() => {
    const settings = require('../../config').default
    expect(settings.project).toBe('configured_project')
    expect(settings.use_root_point).toBe(true)
    expect(settings.franchiseSlug).toBe(34)
    expect(settings.merchantId).toBe('keep-native-id')
  })
})
