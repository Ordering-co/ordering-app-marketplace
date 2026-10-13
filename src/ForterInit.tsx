import { useEffect, useRef } from 'react'
import { useConfig, useSession } from '@components'
import { forterSDK } from 'react-native-forter'

let cachedForterMobileUid: string | null = null

export const getForterMobileUid = () => cachedForterMobileUid

export const ForterInit = () => {
  const [{ configs }] = useConfig()
  const [{ token, user }] = useSession()
  const initialized = useRef(false)

  useEffect(() => {
    if (!forterSDK || initialized.current) return

    const forterEnabled = configs?.braintree_forter_enabled?.value
    const forterSiteId = configs?.braintree_forter_site_id?.value

    if (!forterEnabled || forterEnabled === '0' || !forterSiteId) return

    forterSDK.getDeviceUniqueID((deviceID: string) => {
      cachedForterMobileUid = deviceID
      forterSDK.init(
        forterSiteId,
        deviceID,
        () => {
          if (user?.id) {
            forterSDK.setAccountIdentifier(String(user.id), 'CUSTOMER')
          }
        },
        (error: string) => {
          console.warn('Forter SDK init failed:', error)
        }
      )
    })

    initialized.current = true
  }, [configs?.braintree_forter_enabled?.value, configs?.braintree_forter_site_id?.value, token])

  useEffect(() => {
    if (!forterSDK || !initialized.current || !user?.id) return
    forterSDK.setAccountIdentifier(String(user.id), 'CUSTOMER')
  }, [user?.id])

  return null
}
