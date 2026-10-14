import { Platform, Settings } from 'react-native'
import { getLocalSimulatorSettings, isLocalSimulatorMode } from '../ios-local-mode'

jest.mock('react-native', () => ({ Platform: { OS: 'ios' }, Settings: { get: jest.fn() } }))
const source = { project: 'YOUR_PROJECT', api: { url: 'https://api.example.test', version: 'v400', language: 'en' }, socket: { url: 'https://sockets.example.test' }, franchiseSlug: null, merchantId: 'keep' }
const initialDev = global.__DEV__

beforeEach(() => {
  global.__DEV__ = true
  Platform.OS = 'ios'
  Settings.get.mockImplementation(key => key === 'OrderingLocalSimulatorMode' ? true : { project: 'chosen_project', api: { language: 'es' }, franchiseSlug: 'chosen_franchise', token: 'never-import' })
})
afterEach(() => { global.__DEV__ = initialDev })

it('requires a native boolean or NSNumber marker in an iOS development build', () => {
  expect(isLocalSimulatorMode()).toBe(true)
  Settings.get.mockReturnValue(1)
  expect(isLocalSimulatorMode()).toBe(true)
  Settings.get.mockReturnValue('true')
  expect(isLocalSimulatorMode()).toBe(false)
  Settings.get.mockReturnValue(true)
  Platform.OS = 'android'
  expect(isLocalSimulatorMode()).toBe(false)
  Platform.OS = 'ios'
  global.__DEV__ = false
  expect(isLocalSimulatorMode()).toBe(false)
})
it('imports only public selected fields into a derived copy, never credentials or native identifiers', () => {
  const result = getLocalSimulatorSettings(source)
  expect(result).toEqual({ ...source, project: 'chosen_project', api: { ...source.api, language: 'es' }, franchiseSlug: 'chosen_franchise' })
  expect(result.token).toBeUndefined()
  expect(source.project).toBe('YOUR_PROJECT')
  expect(source.api.language).toBe('en')
})
it('preserves normal configured settings in release and Android', () => {
  global.__DEV__ = false
  expect(getLocalSimulatorSettings(source)).toEqual(source)
  global.__DEV__ = true
  Platform.OS = 'android'
  expect(getLocalSimulatorSettings(source)).toEqual(source)
})

it('fails closed when the native settings module is unavailable', () => {
  Settings.get.mockImplementation(() => { throw new Error('Native module unavailable') })
  expect(isLocalSimulatorMode()).toBe(false)
  expect(getLocalSimulatorSettings(source)).toEqual(source)
})

it('accepts only a safe positive public franchise ID from native preview configuration', () => {
  Settings.get.mockImplementation(key => key === 'OrderingLocalSimulatorMode' ? 1 : { project: 'chosen_project', franchiseSlug: 34 })
  expect(getLocalSimulatorSettings(source).franchiseSlug).toBe(34)
  Settings.get.mockImplementation(key => key === 'OrderingLocalSimulatorMode' ? 1 : { project: 'chosen_project', franchiseSlug: -1 })
  expect(getLocalSimulatorSettings(source).franchiseSlug).toBeNull()
})
