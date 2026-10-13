import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../../utils', () => ({
  findExitingCode: () => ({ countryCode: 'US', phoneCode: '1' }),
  transformCountryCode: (code) => ({ countryCode: 'US', phoneCode: String(code) })
}))

jest.mock('@ui', () => require('../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

import React from 'react'

import { PhoneInputNumber } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('PhoneInputNumber', () => {
  it('renders phone input field', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByTestId } = renderWithProviders(
      <PhoneInputNumber {...d.phoneInputNumberDefaults} />
    )
    expect(getByTestId('phone-input')).toBeTruthy()
  })

  it('shows disabled phone display when input is disabled', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText, queryByTestId } = renderWithProviders(
      <PhoneInputNumber
        {...d.phoneInputNumberDefaults}
        isDisabled
        defaultValue="5551234567"
        defaultCode="US"
      />
    )
    expect(getByText(/5551234567/)).toBeTruthy()
    expect(queryByTestId('phone-input')).toBeNull()
  })

  it('shows validation message when required and empty', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <PhoneInputNumber
        {...d.phoneInputNumberDefaults}
        isStartValidation
      />
    )
    expect(getByText(/Mobile phone is required/)).toBeTruthy()
  })
})
