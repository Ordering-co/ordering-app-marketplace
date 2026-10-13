import {
  isFirebasePushEnabled,
  shouldSetupFirebasePush,
  shouldTeardownFirebasePush
} from '../firebasePushConsent'

describe('isFirebasePushEnabled', () => {
  it('is true only when the config value is the string 1', () => {
    expect(isFirebasePushEnabled({ firebase_push_enabled: { value: '1' } })).toBe(true)
  })

  it('is false for disabled, missing, or malformed configs', () => {
    expect(isFirebasePushEnabled({ firebase_push_enabled: { value: '0' } })).toBe(false)
    expect(isFirebasePushEnabled({ firebase_push_enabled: {} })).toBe(false)
    expect(isFirebasePushEnabled({})).toBe(false)
    expect(isFirebasePushEnabled(undefined)).toBe(false)
    expect(isFirebasePushEnabled(null)).toBe(false)
  })
})

describe('shouldSetupFirebasePush', () => {
  const ready = {
    configsLoading: false,
    enabled: true,
    auth: true,
    hasConsented: true
  }

  it('is true when configs are ready, the flag is on, the user is authed, and consent is granted', () => {
    expect(shouldSetupFirebasePush(ready)).toBe(true)
  })

  it('is false while configs are loading', () => {
    expect(shouldSetupFirebasePush({ ...ready, configsLoading: true })).toBe(false)
  })

  it('is false without the flag, session, or consent', () => {
    expect(shouldSetupFirebasePush({ ...ready, enabled: false })).toBe(false)
    expect(shouldSetupFirebasePush({ ...ready, auth: false })).toBe(false)
    expect(shouldSetupFirebasePush({ ...ready, hasConsented: false })).toBe(false)
  })
})

describe('shouldTeardownFirebasePush', () => {
  it('is true after opt-out once configs have loaded', () => {
    expect(shouldTeardownFirebasePush({
      configsLoading: false,
      enabled: true,
      auth: true,
      hasConsented: false
    })).toBe(true)
  })

  it('is true after logout', () => {
    expect(shouldTeardownFirebasePush({
      configsLoading: false,
      enabled: true,
      auth: false,
      hasConsented: true
    })).toBe(true)
  })

  it('is true when the project turns the flag off', () => {
    expect(shouldTeardownFirebasePush({
      configsLoading: false,
      enabled: false,
      auth: true,
      hasConsented: true
    })).toBe(true)
  })

  it('is false while configs are loading so teardown does not race setup', () => {
    expect(shouldTeardownFirebasePush({
      configsLoading: true,
      enabled: true,
      auth: true,
      hasConsented: false
    })).toBe(false)
  })

  it('is false while everything still allows the setup to run', () => {
    expect(shouldTeardownFirebasePush({
      configsLoading: false,
      enabled: true,
      auth: true,
      hasConsented: true
    })).toBe(false)
  })
})
