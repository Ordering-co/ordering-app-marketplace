import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { CategoryDescriptionMemoized } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('CategoryDescription', () => {
  it('renders category name and description when open', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').categoryDescriptionDefaults
    const { getAllByText, getByText } = renderWithProviders(
      <CategoryDescriptionMemoized {...defaults} />
    )
    expect(getAllByText('Pizzas').length).toBeGreaterThan(0)
    expect(getByText('Fresh oven pizzas')).toBeTruthy()
  })

  it('renders nothing interactive when description is closed', () => {
    const { queryByText } = renderWithProviders(
      <CategoryDescriptionMemoized openDescription={null} setOpenDescription={jest.fn()} />
    )
    expect(queryByText('Fresh oven pizzas')).toBeNull()
  })
})
