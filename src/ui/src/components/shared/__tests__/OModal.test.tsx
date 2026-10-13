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

describe('OModal', () => {
  it('renders title, subtitle, children, and closes', () => {
        const onClose = jest.fn()
        const { getByText } = renderWithProviders(
          <OModal
            open
            title="Modal title"
            subtitle="Subtitle"
            onClose={onClose}
            showToastInsideModal
          >
            <Text>Modal body</Text>
          </OModal>
        )
        expect(getByText('Modal title')).toBeTruthy()
        expect(getByText('Subtitle')).toBeTruthy()
        expect(getByText('Modal body')).toBeTruthy()
      })
})

