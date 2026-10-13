import '../../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

import { AddressMapBoxList } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

describe('AddressMapBoxList', () => {
  it('renders mapbox suggestions (smoke)', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <AddressMapBoxList {...d.addressMapBoxListDefaults} />
    )
    expect(getByText('123 Main St, New York, NY')).toBeTruthy()
  })

  it('selects a suggestion on press', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const retrieveSuggestResult = jest.fn()
    const handleChangeInputAddress = jest.fn()
    const onBlurInput = jest.fn()
    const { getByText } = renderWithProviders(
      <AddressMapBoxList
        {...d.addressMapBoxListDefaults}
        retrieveSuggestResult={retrieveSuggestResult}
        handleChangeInputAddress={handleChangeInputAddress}
        onBlurInput={onBlurInput}
      />
    )
    fireEvent.press(getByText('123 Main St, New York, NY'))
    expect(retrieveSuggestResult).toHaveBeenCalledWith('mb-1', expect.any(Function))
    expect(handleChangeInputAddress).toHaveBeenCalledWith('123 Main St, New York, NY')
    expect(onBlurInput).toHaveBeenCalled()
  })
})
