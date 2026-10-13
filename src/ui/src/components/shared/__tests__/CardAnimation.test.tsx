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

import { CardAnimation } from '../CardAnimation'
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

describe('CardAnimation', () => {
  it('handles press in and out', () => {
        const onClick = jest.fn()
        const { getByText } = renderWithProviders(
          <CardAnimation onClick={onClick}>
            <Text>Card</Text>
          </CardAnimation>
        )
        const card = getByText('Card')
        fireEvent(card, 'pressIn')
        fireEvent(card, 'pressOut')
        fireEvent.press(card)
        expect(onClick).toHaveBeenCalled()
      })
})

