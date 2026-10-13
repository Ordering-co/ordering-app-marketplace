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

import ODropDown from '../ODropDown'
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

describe('ODropDown', () => {
  const options = [
        { value: 'a', name: 'Option A' },
        { value: 'b', name: 'Option B' }
      ]
  
      it('opens list and selects an option', () => {
        const onSelect = jest.fn()
        const { getByText } = renderWithProviders(
          <ODropDown
            options={options}
            defaultValue="a"
            placeholder="Pick one"
            onSelect={onSelect}
          />
        )
        expect(getByText('Option A')).toBeTruthy()
        fireEvent.press(getByText('Option A'))
        fireEvent.press(getByText('Option B'))
        expect(onSelect).toHaveBeenCalledWith('b')
      })
})

