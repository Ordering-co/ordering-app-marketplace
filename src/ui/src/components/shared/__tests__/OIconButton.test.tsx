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

import OIconButton from '../OIconButton'
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

describe('OIconButton', () => {
  it('handles press when enabled', () => {
        const onClick = jest.fn()
        const { getByText } = renderWithProviders(
          <OIconButton title="Share" icon={iconSource} onClick={onClick} color="#000" />
        )
        fireEvent.press(getByText('Share'))
        expect(onClick).toHaveBeenCalled()
      })
  
      it('renders disabled state', () => {
        const { getByText } = renderWithProviders(
          <OIconButton title="Off" disabled icon={iconSource} />
        )
        expect(getByText('Off')).toBeTruthy()
      })
})

