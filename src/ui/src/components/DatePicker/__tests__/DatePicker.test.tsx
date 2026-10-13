import '../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'

import { DatePickerUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('DatePicker', () => {
  it('renders date picker when open', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByTestId } = renderWithProviders(
      <DatePickerUI {...d.datePickerDefaults} />
    )
    expect(getByTestId('date-picker')).toBeTruthy()
  })

  it('renders closed picker without modal content', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByTestId } = renderWithProviders(
      <DatePickerUI {...d.datePickerDefaults} open={false} />
    )
    expect(getByTestId('date-picker')).toBeTruthy()
  })
})
