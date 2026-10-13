import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { waitFor } from '@testing-library/react-native'

import { StripeMethodForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('StripeMethodForm', () => {
  it('checks platform pay support on mount', async () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const setMethodPaySupported = jest.fn()
    renderWithProviders(
      <StripeMethodForm
        {...d.stripeMethodFormDefaults}
        setMethodPaySupported={setMethodPaySupported}
      />
    )
    await waitFor(() => {
      expect(setMethodPaySupported).toHaveBeenCalled()
    })
  })

  it('renders null UI shell without crashing', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { toJSON } = renderWithProviders(
      <StripeMethodForm {...d.stripeMethodFormDefaults} />
    )
    expect(toJSON()).toBeNull()
  })
})
