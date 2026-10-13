import React from 'react'
import { Keyboard, Linking, Vibration } from 'react-native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import Intercom from '@intercom/intercom-react-native'

import { useConfig, useSession } from '@components'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

import { SupportBubble } from '..'

jest.mock('@intercom/intercom-react-native', () => ({
  registerIdentifiedUser: jest.fn(() => Promise.resolve()),
  registerUnidentifiedUser: jest.fn(() => Promise.resolve()),
  displayMessenger: jest.fn(() => Promise.resolve()),
  hideIntercom: jest.fn(),
  logout: jest.fn()
}))

jest.mock('@/contexts/CookieConsentContext', () => ({
  useCookieConsent: jest.fn(() => ({ hasConsented: false }))
}))

const configs = (overrides: Record<string, string> = {}) => ({
  whatsapp_support_enabled: { value: overrides.whatsapp ?? '0' },
  whatsapp_support_phone: { value: overrides.phone ?? '' },
  intercom_enabled: { value: overrides.intercom ?? '0' }
})

describe('SupportBubble', () => {
  let keyboardHandlers: Record<string, () => void>

  beforeEach(() => {
    jest.clearAllMocks()
    keyboardHandlers = {}
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, handler) => {
      keyboardHandlers[event] = handler as () => void
      return { remove: jest.fn() } as any
    })
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as any)
    jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {})
    ;(useConfig as jest.Mock).mockReturnValue([{ configs: configs() }])
    ;(useSession as jest.Mock).mockReturnValue([{ auth: true, user: { id: 7, email: 'jane@test.com' } }, {}])
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: false })
  })

  it('opens WhatsApp with a digits-only number and ignores consent', () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: configs({ whatsapp: '1', phone: '+243 81-000 22', intercom: '1' })
    }])
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: false })

    const { getByTestId } = renderWithProviders(<SupportBubble />)
    fireEvent.press(getByTestId('support-bubble'))

    expect(Linking.openURL).toHaveBeenCalledWith('https://wa.me/2438100022')
    expect(Intercom.displayMessenger).not.toHaveBeenCalled()
  })

  it('opens Intercom when WhatsApp is off and the user consented', async () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: configs({ intercom: '1' })
    }])
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: true })

    const { getByLabelText } = renderWithProviders(<SupportBubble />)
    fireEvent.press(getByLabelText('Chat with support'))

    expect(Vibration.vibrate).toHaveBeenCalled()
    await waitFor(() => {
      expect(Intercom.registerIdentifiedUser).toHaveBeenCalledWith({
        userId: '7',
        email: 'jane@test.com'
      })
      expect(Intercom.displayMessenger).toHaveBeenCalled()
    })
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('renders nothing when both channels are off', () => {
    const { queryByTestId } = renderWithProviders(<SupportBubble />)
    expect(queryByTestId('support-bubble')).toBeNull()
  })

  it('renders nothing for Intercom without consent', () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: configs({ intercom: '1', phone: '2438100022' })
    }])
    const { queryByTestId } = renderWithProviders(<SupportBubble />)
    expect(queryByTestId('support-bubble')).toBeNull()
  })

  it('hides while the keyboard is open', () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: configs({ whatsapp: '1', phone: '2438100022' })
    }])
    const { getByTestId, queryByTestId } = renderWithProviders(<SupportBubble />)
    expect(getByTestId('support-bubble')).toBeTruthy()

    act(() => {
      keyboardHandlers.keyboardDidShow()
    })
    expect(queryByTestId('support-bubble')).toBeNull()

    act(() => {
      keyboardHandlers.keyboardDidHide()
    })
    expect(getByTestId('support-bubble')).toBeTruthy()
  })

  it('falls through to Intercom when the WhatsApp number has no digits', async () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: configs({ whatsapp: '1', phone: '++ --', intercom: '1' })
    }])
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: true })

    const { getByLabelText } = renderWithProviders(<SupportBubble />)
    fireEvent.press(getByLabelText('Chat with support'))

    await waitFor(() => {
      expect(Intercom.displayMessenger).toHaveBeenCalled()
    })
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('hides Intercom when the bubble unmounts after consent', () => {
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: true })
    const { unmount } = renderWithProviders(<SupportBubble />)
    unmount()
    expect(Intercom.hideIntercom).toHaveBeenCalled()
  })
})
