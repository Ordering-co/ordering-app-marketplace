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

import * as SharedExports from '../index'


beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn())
    jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({ remove: jest.fn() }))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

describe('shared index exports', () => {
  it('re-exports all shared primitives', () => {
        expect(SharedExports.OButton).toBeDefined()
        expect(SharedExports.OText).toBeDefined()
        expect(SharedExports.OInput).toBeDefined()
        expect(SharedExports.ODropDown).toBeDefined()
        expect(SharedExports.OIcon).toBeDefined()
        expect(SharedExports.OIconText).toBeDefined()
        expect(SharedExports.OIconButton).toBeDefined()
        expect(SharedExports.OTextarea).toBeDefined()
        expect(SharedExports.OToggle).toBeDefined()
        expect(SharedExports.OKeyButton).toBeDefined()
        expect(SharedExports.OAlert).toBeDefined()
        expect(SharedExports.OModal).toBeDefined()
        expect(SharedExports.OBottomPopup).toBeDefined()
        expect(SharedExports.HeaderTitle).toBeDefined()
        expect(SharedExports.CardAnimation).toBeDefined()
      })
})

