import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessPreorder } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return m4.getMock({
    MomentOption: m4.renderUiController({
      ...d.businessPreorderDefaults,
      isAsap: false,
      cateringPreorder: true,
      timeSelected: null,
      dateSelected: '2026-07-16'
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('BusinessPreorder', () => {
  it('renders preorder shell with actions', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults')
    const { getByTestId, toJSON } = renderWithProviders(
      <BusinessPreorder business={defaults.sampleBusiness} />
    )
    expect(toJSON()).toBeTruthy()
    expect(getByTestId('floating-button')).toBeTruthy()
  })

  it('renders schedule calendar strip', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults')
    const { getByTestId } = renderWithProviders(
      <BusinessPreorder business={defaults.sampleBusiness} />
    )
    expect(getByTestId('calendar-strip')).toBeTruthy()
  })

  it('presses floating button to continue', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults')
    const { getByTestId } = renderWithProviders(
      <BusinessPreorder business={defaults.sampleBusiness} />
    )
    fireEvent.press(getByTestId('floating-button'))
  })
})
