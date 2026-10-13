import '../../../../../../jest/helpers/registerM7NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ReviewProducts } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m7ReviewsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m7ReviewsUiMock').getUiMock())

describe('ReviewProducts', () => {
  it('renders product review list', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const { getByText } = renderWithProviders(
      <ReviewProducts {...d.reviewProductsDefaults} />
    )
    expect(getByText('Cheese Slice')).toBeTruthy()
  })

  it('submits product reviews when continue is pressed', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const handleSendProductReview = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewProducts {...d.reviewProductsDefaults} handleSendProductReview={handleSendProductReview} />
    )
    fireEvent.press(getByText('Continue'))
    expect(handleSendProductReview).toHaveBeenCalled()
  })
})
