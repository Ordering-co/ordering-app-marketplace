import '../../../../../../jest/helpers/registerM7NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ReviewOrderUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m7ReviewsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m7ReviewsUiMock').getUiMock())

describe('ReviewOrder', () => {
  it('renders order review prompt', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const { getByText } = renderWithProviders(
      <ReviewOrderUI {...d.reviewOrderDefaults} />
    )
    expect(getByText('Rate the experience')).toBeTruthy()
  })

  it('shows already reviewed message when order was reviewed', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const { getByText } = renderWithProviders(
      <ReviewOrderUI
        {...d.reviewOrderDefaults}
        order={{ ...d.reviewOrder, review: true }}
      />
    )
    expect(getByText(/already reviewed/i)).toBeTruthy()
  })

  it('submits review when continue is pressed', async () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const handleSendReview = jest.fn().mockResolvedValue(true)
    const { getByText } = renderWithProviders(
      <ReviewOrderUI
        {...d.reviewOrderDefaults}
        handleSendReview={handleSendReview}
      />
    )
    fireEvent.press(getByText('Continue'))
    expect(handleSendReview).toHaveBeenCalled()
  })
})
