import React from 'react'
import { Alert, Text, Vibration, Keyboard, Platform } from 'react-native'
import { act, fireEvent } from '@testing-library/react-native'
import { ToastType, useToast } from '@components'


jest.mock('@ui', () => {
  const OText = require('@/ui/src/components/shared/OText').default
  return {
    OText,
    SafeAreaViewWrapper: ({ children }: { children: React.ReactNode }) => children,
    Toast: () => null
  }
})


const iconSource = 1

import OBottomPopup from '../OBottomPopup'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'


beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn())
    jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({ remove: jest.fn() }))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

describe('OBottomPopup', () => {
  it('renders when open with title and handle bar', () => {
        const onClose = jest.fn()
        const { getByText } = renderWithProviders(
          <OBottomPopup
            open
            title="Popup"
            onClose={onClose}
            showHandleBar
            closeIcon
            isStatusBar
          >
            <Text>Popup content</Text>
          </OBottomPopup>
        )
        expect(getByText('Popup')).toBeTruthy()
        expect(getByText('Popup content')).toBeTruthy()
      })
})

