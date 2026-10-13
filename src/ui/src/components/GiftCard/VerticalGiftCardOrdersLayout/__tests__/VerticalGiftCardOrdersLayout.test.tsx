import '../../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../../shared', () => require('../../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { VerticalGiftCardOrdersLayout } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('VerticalGiftCardOrdersLayout', () => {
  it('renders gift card list with title', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getAllByText, getByText } = renderWithProviders(
      <VerticalGiftCardOrdersLayout
        {...d.verticalGiftCardOrdersLayoutDefaults}
        title="Pending"
      />
    )
    expect(getAllByText('Pending').length).toBeGreaterThan(0)
    expect(getByText('$25 Gift Card')).toBeTruthy()
  })

  it('shows load more when more pages exist', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const loadMoreOrders = jest.fn()
    const { getByText } = renderWithProviders(
      <VerticalGiftCardOrdersLayout
        {...d.verticalGiftCardOrdersLayoutDefaults}
        paginationProps={{ totalPages: 3, currentPage: 1 }}
        loadMoreOrders={loadMoreOrders}
      />
    )
    fireEvent.press(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })
})
