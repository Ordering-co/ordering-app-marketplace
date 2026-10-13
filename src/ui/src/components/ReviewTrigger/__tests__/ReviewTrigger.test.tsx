import '../../../../../../jest/helpers/registerM7NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ReviewTrigger } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => {
  const OText = require('@/ui/src/components/shared/OText').default
  const OButton = require('@/ui/src/components/shared/OButton').default
  return { OText, OButton }
})

describe('ReviewTrigger', () => {
  it('renders review prompt and business name', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const { getByText } = renderWithProviders(
      <ReviewTrigger {...d.reviewTriggerDefaults} />
    )
    expect(getByText(/Your feedback is very important/i)).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('calls handleOpenOrderReview when review button is pressed', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const handleOpenOrderReview = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewTrigger {...d.reviewTriggerDefaults} handleOpenOrderReview={handleOpenOrderReview} />
    )
    fireEvent.press(getByText('Review'))
    expect(handleOpenOrderReview).toHaveBeenCalledWith(5)
  })
})
