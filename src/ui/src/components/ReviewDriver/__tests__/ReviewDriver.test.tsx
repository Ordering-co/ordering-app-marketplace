import '../../../../../../jest/helpers/registerM7NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ReviewDriver } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m7ReviewsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m7ReviewsUiMock').getUiMock())

describe('ReviewDriver', () => {
  it('renders driver review prompt', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const { getByText } = renderWithProviders(
      <ReviewDriver {...d.reviewDriverDefaults} />
    )
    expect(getByText('Rate the experience')).toBeTruthy()
    expect(getByText(/How was your experience with Driver/i)).toBeTruthy()
  })

  it('submits review when continue is pressed', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const handleSendDriverReview = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewDriver {...d.reviewDriverDefaults} handleSendDriverReview={handleSendDriverReview} />
    )
    fireEvent.press(getByText('Continue'))
    expect(handleSendDriverReview).toHaveBeenCalled()
  })
})
