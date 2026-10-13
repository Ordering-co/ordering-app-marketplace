import React, { useEffect, useState } from 'react'
import { Keyboard, Linking, Vibration } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useConfig, useLanguage } from '@components'

import { Bubble, SUPPORT_BUBBLE_CLEARANCE } from './styles'
import { resolveSupportAction, whatsappUrl } from './supportChannel'
import { useIntercomChat } from './useIntercomChat'

const enabled = (configs: any, key: string) => configs?.[key]?.value === '1'

export const SupportBubble = () => {
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { hasConsented, openIntercom } = useIntercomChat()
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  const phone = configs?.whatsapp_support_phone?.value
  const action = resolveSupportAction({
    whatsappEnabled: enabled(configs, 'whatsapp_support_enabled'),
    phone,
    intercomEnabled: enabled(configs, 'intercom_enabled'),
    hasConsented
  })

  if (keyboardOpen || !action) return null

  const openWhatsapp = () => {
    const url = whatsappUrl(phone)
    if (!url) return
    Vibration.vibrate()
    Linking.openURL(url).catch(() => {})
  }

  const whatsapp = action === 'whatsapp'

  return (
    <Bubble
      testID="support-bubble"
      $whatsapp={whatsapp}
      bottom={insets.bottom + SUPPORT_BUBBLE_CLEARANCE}
      accessibilityRole="button"
      accessibilityLabel={whatsapp
        ? t('WHATSAPP_SUPPORT_BUTTON', 'Write to us on WhatsApp')
        : t('INTERCOM_SUPPORT_BUTTON', 'Chat with support')}
      onPress={whatsapp ? openWhatsapp : openIntercom}
    >
      <Ionicons
        name={whatsapp ? 'logo-whatsapp' : 'chatbox'}
        size={28}
        color={theme.colors.white}
      />
    </Bubble>
  )
}
