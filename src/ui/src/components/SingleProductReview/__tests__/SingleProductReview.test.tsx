import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { SingleProductReview } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('SingleProductReview', () => {
  it('renders product review prompt', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').singleProductReviewDefaults
    const { getByText } = renderWithProviders(
      <SingleProductReview {...defaults} />
    )
    expect(getByText(/How was your experience with/)).toBeTruthy()
    expect(getByText(/Cheese Slice/)).toBeTruthy()
  })

  it('toggles comment chips and updates form state', () => {
    const handleChangeFormState = jest.fn()
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').singleProductReviewDefaults
    const { getByText } = renderWithProviders(
      <SingleProductReview
        {...defaults}
        handleChangeFormState={handleChangeFormState}
      />
    )
    fireEvent.press(getByText('Tasty'))
    expect(handleChangeFormState).toHaveBeenCalled()
  })

  it('allows additional comments', () => {
    const handleChangeFormState = jest.fn()
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').singleProductReviewDefaults
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <SingleProductReview
        {...defaults}
        handleChangeFormState={handleChangeFormState}
      />
    )
    fireEvent.changeText(getByPlaceholderText('Comments'), 'Great meal')
    expect(getByText(/Do you want to add something/)).toBeTruthy()
  })
})
