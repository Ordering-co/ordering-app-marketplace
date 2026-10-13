import React from 'react'

import { mawejaStepIndex, MawejaProgress, MawejaStatusHero } from '..'
import { renderWithProviders } from '../../../../../../../../jest/helpers/renderWithProviders'

describe('Maweja order tracking', () => {
  it('maps order statuses onto the four tracking steps', () => {
    expect(mawejaStepIndex(0)).toBe(0)
    expect(mawejaStepIndex(7)).toBe(1)
    expect(mawejaStepIndex(9)).toBe(2)
    expect(mawejaStepIndex(11)).toBe(3)
    expect(mawejaStepIndex(2)).toBe(0)
  })

  it('shows the pending hero and the progress caption', () => {
    const { getAllByText, getByText } = renderWithProviders(
      <>
        <MawejaStatusHero tone="brand" kicker="Live order" title="Order waiting for validation" subtitle="Coffee Shop" />
        <MawejaProgress
          title="Progress"
          labels={['Received', 'Confirmed', 'Out for delivery', 'Delivered']}
          caption="Order waiting for validation"
          step={0}
        />
      </>
    )
    expect(getAllByText('Order waiting for validation').length).toBeGreaterThan(0)
    expect(getByText('Coffee Shop')).toBeTruthy()
    expect(getByText('Received')).toBeTruthy()
  })

  it('shows the delivered hero', () => {
    const { getByText } = renderWithProviders(
      <MawejaStatusHero tone="success" kicker="Delivered" title="Order delivered!" subtitle="Thank you" />
    )
    expect(getByText('Order delivered!')).toBeTruthy()
    expect(getByText('Thank you')).toBeTruthy()
  })
})
