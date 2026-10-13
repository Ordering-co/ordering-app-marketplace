declare module 'react-native-forter' {
  interface ForterSDK {
    init(siteId: string, mobileUid: string, successCb: (result: string) => void, errorCb: (error: string) => void): void
    getDeviceUniqueID(callback: (deviceID: string) => void): void
    setAccountIdentifier(accountUid: string, accountType: string): void
    getForterToken(successCb: (token: string) => void, errorCb: (error: string) => void): void
    registerForterTokenListener(callback: (token: string) => void): void
    trackNavigation(screenName: string, navigationType: string): void
    trackAction(actionType: string): void
    setDevLogsEnabled(): void
  }

  export const forterSDK: ForterSDK
  export const ForterNavigationType: Record<string, string>
  export const ForterActionType: Record<string, string>
  export const ForterAccountType: Record<string, string>
}
