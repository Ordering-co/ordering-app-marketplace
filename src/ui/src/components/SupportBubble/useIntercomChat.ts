import { useEffect } from 'react'
import { Vibration } from 'react-native'
import Intercom from '@intercom/intercom-react-native'
import { useSession } from '@components'

import { useCookieConsent } from '@/contexts/CookieConsentContext'

export const useIntercomChat = () => {
  const [{ user }] = useSession()
  const { hasConsented } = useCookieConsent()

  const openIntercom = async () => {
    Vibration.vibrate()
    try {
      if (user?.id) {
        const interParams: { userId: string, email?: string } = { userId: String(user.id) }
        if (user.email) interParams.email = user.email
        await Intercom.registerIdentifiedUser(interParams).catch(() => {})
      } else {
        await Intercom.registerUnidentifiedUser().catch(() => {})
      }
      await Intercom.displayMessenger()
    } catch {
      // Intercom is not configured on this build.
    }
  }

  useEffect(() => {
    return () => {
      if (!hasConsented) return
      try {
        Intercom.hideIntercom()
      } catch {
        // Intercom is not configured on this build.
      }
    }
  }, [hasConsented])

  return { hasConsented, openIntercom }
}
