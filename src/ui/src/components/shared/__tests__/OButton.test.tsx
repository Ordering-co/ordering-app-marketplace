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

import OButton from '../OButton'
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

describe('OButton', () => {
  it('renders and handles press', () => {
        const onClick = jest.fn()
        const { getByText } = renderWithProviders(
          <OButton text="Continue" testID="continue-btn" onClick={onClick} />
        )
        fireEvent.press(getByText('Continue'))
        expect(onClick).toHaveBeenCalled()
      })
  
      it('renders disabled state', () => {
        const { getByText } = renderWithProviders(
          <OButton text="Disabled" disabled />
        )
        expect(getByText('Disabled')).toBeTruthy()
      })
  
      it('renders loading state', () => {
        const { getByText } = renderWithProviders(
          <OButton text="Loading" loading class="secondary" />
        )
        expect(getByText('Loading')).toBeTruthy()
      })
  
      it.each(['primary', 'secondary', 'third', 'fourth', 'active', 'mandatory', 'alert'] as const)(
        'renders class %s',
        (buttonClass) => {
          const { getByText } = renderWithProviders(
            <OButton text={buttonClass} class={buttonClass} />
          )
          expect(getByText(buttonClass)).toBeTruthy()
        }
      )
})

