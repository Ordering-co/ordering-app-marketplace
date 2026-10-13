import '../../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../../shared', () => require('../../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'

import { SendGiftCard } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('SendGiftCard', () => {
  it('renders send gift card form (smoke)', () => {
    const { getByText } = renderWithProviders(
      <SendGiftCard onClose={jest.fn()} />
    )
    expect(getByText('Gift Card details')).toBeTruthy()
    expect(getByText('Send gift card')).toBeTruthy()
  })
})
