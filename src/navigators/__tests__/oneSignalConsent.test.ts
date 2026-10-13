import {
  findNotificationTokenId,
  getNotificationTokensUrl,
  shouldPromptForPushNotifications,
  shouldSetupOneSignal,
  shouldTeardownOneSignal
} from '../oneSignalConsent'

describe('shouldSetupOneSignal', () => {
  const ready = {
    configsLoading: false,
    appId: 'onesignal-app',
    auth: true,
    hasConsented: true
  }

  it('is true when configs are ready, the user is authed, and consent is granted', () => {
    expect(shouldSetupOneSignal(ready)).toBe(true)
  })

  it('is false while configs are loading', () => {
    expect(shouldSetupOneSignal({ ...ready, configsLoading: true })).toBe(false)
  })

  it('is false without an app id, session, or consent', () => {
    expect(shouldSetupOneSignal({ ...ready, appId: '' })).toBe(false)
    expect(shouldSetupOneSignal({ ...ready, auth: false })).toBe(false)
    expect(shouldSetupOneSignal({ ...ready, hasConsented: false })).toBe(false)
  })
})

describe('shouldTeardownOneSignal', () => {
  it('is true after opt-out once configs have loaded', () => {
    expect(shouldTeardownOneSignal({
      configsLoading: false,
      appId: 'onesignal-app',
      auth: true,
      hasConsented: false
    })).toBe(true)
  })

  it('is false while configs are loading so teardown does not race setup', () => {
    expect(shouldTeardownOneSignal({
      configsLoading: true,
      appId: 'onesignal-app',
      auth: true,
      hasConsented: false
    })).toBe(false)
  })

  it('is false when setup should still run', () => {
    expect(shouldTeardownOneSignal({
      configsLoading: false,
      appId: 'onesignal-app',
      auth: true,
      hasConsented: true
    })).toBe(false)
  })
})

describe('shouldPromptForPushNotifications', () => {
  it('does not re-prompt when the OS already granted permission', () => {
    expect(shouldPromptForPushNotifications({ hasNotificationPermission: true })).toBe(false)
  })

  it('prompts when permission is missing', () => {
    expect(shouldPromptForPushNotifications({ hasNotificationPermission: false })).toBe(true)
    expect(shouldPromptForPushNotifications(null)).toBe(true)
  })
})

describe('findNotificationTokenId', () => {
  it('finds the backend row id for a OneSignal player id', () => {
    expect(findNotificationTokenId({
      result: [
        { id: 11, token: 'other' },
        { id: 22, token: 'player-1' }
      ]
    }, 'player-1')).toBe(22)
  })

  it('accepts a bare array payload', () => {
    expect(findNotificationTokenId([{ id: 7, token: 'player-1' }], 'player-1')).toBe(7)
  })

  it('returns null when the token is missing', () => {
    expect(findNotificationTokenId({ result: [{ id: 11, token: 'other' }] }, 'player-1')).toBe(null)
    expect(findNotificationTokenId(null, 'player-1')).toBe(null)
    expect(findNotificationTokenId({ result: [] }, null)).toBe(null)
  })
})

describe('getNotificationTokensUrl', () => {
  it('builds the user notification_tokens collection URL', () => {
    expect(getNotificationTokensUrl('https://api.example/v400/en/demo', 44))
      .toBe('https://api.example/v400/en/demo/users/44/notification_tokens')
  })

  it('returns null without a root or user id', () => {
    expect(getNotificationTokensUrl(undefined, 44)).toBe(null)
    expect(getNotificationTokensUrl('https://api.example', undefined)).toBe(null)
  })
})
