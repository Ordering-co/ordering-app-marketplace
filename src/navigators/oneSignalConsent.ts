type OneSignalGate = {
  configsLoading?: boolean
  appId?: unknown
  auth?: unknown
  hasConsented?: unknown
}

export function shouldSetupOneSignal (params: OneSignalGate) {
  return !params.configsLoading && !!params.appId && !!params.auth && !!params.hasConsented
}

export function shouldTeardownOneSignal (params: OneSignalGate) {
  return !params.configsLoading && !shouldSetupOneSignal(params)
}

export function shouldPromptForPushNotifications (deviceState?: { hasNotificationPermission?: boolean } | null) {
  return !deviceState?.hasNotificationPermission
}

export function findNotificationTokenId (payload: unknown, playerId: unknown) {
  if (playerId == null || playerId === '') return null
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { result?: unknown }).result)
      ? (payload as { result: unknown[] }).result
      : []
  const match = list.find((item: any) => item?.token === playerId)
  return match?.id ?? null
}

export function getNotificationTokensUrl (root: unknown, userId: unknown) {
  if (!root || userId == null || userId === '') return null
  return `${root}/users/${userId}/notification_tokens`
}
