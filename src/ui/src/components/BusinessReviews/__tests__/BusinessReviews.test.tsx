import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'

import { BusinessReviews } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('BusinessReviews', () => {
  it('renders average rating and review comments', () => {
    const { getByText } = renderWithProviders(
      <BusinessReviews businessId={1} reviews={[1]} />
    )
    expect(getByText('4.5')).toBeTruthy()
    expect(getByText('Great pizza')).toBeTruthy()
    expect(getByText(/of the 5.0/i)).toBeTruthy()
  })
})
