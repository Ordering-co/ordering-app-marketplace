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

import OModal from '../OModal'
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

describe('styles (via modal chrome)', () => {
  it('renders modal layout on ios and android', () => {
        Platform.OS = 'ios'
        const { getByText: getIos } = renderWithProviders(
          <OModal open title="iOS modal" onClose={jest.fn()} />
        )
        expect(getIos('iOS modal')).toBeTruthy()
  
        Platform.OS = 'android'
        const { getByText: getAndroid } = renderWithProviders(
          <OModal open title="Android modal" onClose={jest.fn()} isTransparent />
        )
        expect(getAndroid('Android modal')).toBeTruthy()
      })
})

