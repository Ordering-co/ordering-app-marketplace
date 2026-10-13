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

import OToggle from '../OToggle'
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

describe('OToggle', () => {
  it('toggles on press', () => {
        const onToggle = jest.fn()
        const { UNSAFE_getByType } = renderWithProviders(
          <OToggle isOn={false} onToggle={onToggle} label="Notify" size="small" />
        )
        const touchable = UNSAFE_getByType(require('react-native').TouchableOpacity)
        fireEvent.press(touchable)
        expect(onToggle).toHaveBeenCalledWith(true)
      })
  
      it('does not toggle when disabled', () => {
        const onToggle = jest.fn()
        const { UNSAFE_getByType } = renderWithProviders(
          <OToggle isOn onToggle={onToggle} disabled size="large" />
        )
        fireEvent.press(UNSAFE_getByType(require('react-native').TouchableOpacity))
        expect(onToggle).not.toHaveBeenCalled()
      })
})

