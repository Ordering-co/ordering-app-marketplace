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

import { Toast } from '../OToast'
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

describe('Toast (OToast)', () => {
  it('renders success toast and hides after duration', () => {
        jest.useFakeTimers()
        const hideToast = jest.fn()
        ;(useToast as jest.Mock).mockReturnValue([
          { type: ToastType.Success, message: 'Saved', duration: 300 },
          { hideToast }
        ])
  
        const { getByText } = renderWithProviders(<Toast />)
        expect(getByText('Saved')).toBeTruthy()
  
        act(() => {
          jest.advanceTimersByTime(300 + 300)
        })
  
        expect(hideToast).toHaveBeenCalled()
      })
  
      it('returns null without toast config', () => {
        ;(useToast as jest.Mock).mockReturnValue([null, { hideToast: jest.fn() }])
        const { toJSON } = renderWithProviders(<Toast />)
        expect(toJSON()).toBeNull()
      })
  
      it('renders info and error toast types', () => {
        ;(useToast as jest.Mock).mockReturnValue([
          { type: ToastType.Info, message: 'Info msg', duration: 1000 },
          { hideToast: jest.fn() }
        ])
        const { getByText, rerender } = renderWithProviders(<Toast />)
        expect(getByText('Info msg')).toBeTruthy()
  
        ;(useToast as jest.Mock).mockReturnValue([
          { type: ToastType.Error, message: 'Error msg', duration: 1000 },
          { hideToast: jest.fn() }
        ])
        rerender(<Toast />)
        expect(getByText('Error msg')).toBeTruthy()
      })
})

