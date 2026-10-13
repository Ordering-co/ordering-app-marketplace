import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'

import { UserProfileForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m8ProfileComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m8ProfileUiMock').getUiMock())

describe('UserProfileForm', () => {
  it('renders user name and profile form', () => {
    const { getByText } = renderWithProviders(<UserProfileForm />)
    expect(getByText(/Jane/)).toBeTruthy()
    expect(getByText('viewing')).toBeTruthy()
  })
})
