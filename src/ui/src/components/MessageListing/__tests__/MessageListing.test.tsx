import '../../../../../../jest/helpers/registerM7NativeMocks'

import React from 'react'

import { MessageListing } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m7ReviewsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m7ReviewsUiMock').getUiMock())

describe('MessageListing', () => {
  const m7 = require('../../../../../../jest/helpers/m7ReviewsComponentsMock')
  const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')

  beforeEach(() => {
    m7.resetMockState()
  })

  it('renders active orders from order list', () => {
    const { getByText } = renderWithProviders(
      <MessageListing onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('1')).toBeTruthy()
  })

  it('shows empty state when there are no orders', () => {
    m7.setMockState({ orderListDefaults: d.messageListingEmptyDefaults })
    const { getByText } = renderWithProviders(
      <MessageListing onNavigationRedirect={jest.fn()} />
    )
    expect(getByText(/Sorry, no results found/i)).toBeTruthy()
  })
})
