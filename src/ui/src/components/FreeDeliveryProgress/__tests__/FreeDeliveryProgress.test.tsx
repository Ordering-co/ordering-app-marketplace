import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { FreeDeliveryProgress } from '..'

describe('FreeDeliveryProgress', () => {
  it.each(['awareness', 'progress', 'unconfirmed', 'unlocked'] as const)('shows %s without an icon', (status) => {
    const { UNSAFE_queryAllByType } = renderWithProviders(
      <FreeDeliveryProgress status={status} minimum={30} remainingAmount={18} progressPercent={40} />
    )

    expect(UNSAFE_queryAllByType('Icon')).toHaveLength(0)
  })

  it('renders nothing for the hidden state', () => {
    const { queryByTestId } = renderWithProviders(
      <FreeDeliveryProgress status='hidden' minimum={20} />
    )

    expect(queryByTestId('free-delivery-progress')).toBeNull()
  })

  it('shows the formatted minimum for awareness', () => {
    const { getByText, queryByTestId } = renderWithProviders(
      <FreeDeliveryProgress status='awareness' minimum={20.5} />
    )

    expect(getByText('Free delivery on orders $20.5+')).toBeTruthy()
    expect(queryByTestId('free-delivery-progress-bar')).toBeNull()
  })

  it.each(['compact', 'full'] as const)('shows accessible progress in the %s variant', (variant) => {
    const { getByText, getByTestId } = renderWithProviders(
      <FreeDeliveryProgress
        status='progress'
        remainingAmount={4.25}
        progressPercent={75}
        variant={variant}
      />
    )

    expect(getByText('Add $4.25 for free delivery')).toBeTruthy()
    expect(getByTestId('free-delivery-progress')).toHaveProp('accessibilityLabel', 'Add $4.25 for free delivery')
    expect(getByTestId('free-delivery-progress-bar')).toHaveProp('accessibilityValue', {
      min: 0,
      max: 100,
      now: 75
    })
    expect(getByTestId('free-delivery-progress')).toHaveProp('variant', variant)
  })

  it('announces unlocked in text without relying on color', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <FreeDeliveryProgress status='unlocked' variant='full' />
    )

    expect(getByText('Free delivery unlocked')).toBeTruthy()
    expect(getByTestId('free-delivery-progress')).toHaveProp('accessibilityLabel', 'Free delivery unlocked')
  })

  it('does not promise free delivery until the cart confirms the offer', () => {
    const { getByText, getByTestId, queryByText, queryByTestId } = renderWithProviders(
      <FreeDeliveryProgress status='unconfirmed' variant='compact' />
    )

    expect(getByText('Free delivery has not been applied to this cart yet')).toBeTruthy()
    expect(getByTestId('free-delivery-progress')).toHaveProp('accessibilityLabel', 'Free delivery has not been applied to this cart yet')
    expect(queryByText('Free delivery unlocked')).toBeNull()
    expect(queryByTestId('free-delivery-progress-bar')).toBeNull()
  })
})
