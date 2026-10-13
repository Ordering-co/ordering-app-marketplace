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

import OAlert from '../OAlert'
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

describe('OAlert', () => {
  it('shows native alert on press', () => {
        const onAccept = jest.fn()
        const onCancel = jest.fn()
        const { getByText } = renderWithProviders(
          <OAlert title="Delete?" message="Sure?" onAccept={onAccept} onCancel={onCancel}>
            <Text>Delete</Text>
          </OAlert>
        )
        fireEvent.press(getByText('Delete'))
        expect(Vibration.vibrate).toHaveBeenCalledWith(100)
        expect(Alert.alert).toHaveBeenCalled()
      })
})

