import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { CitiesControl } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('CitiesControl', () => {
  it('renders enabled cities', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <CitiesControl {...d.citiesControlDefaults} />
    )
    expect(getByText('New York')).toBeTruthy()
    expect(getByText('Los Angeles')).toBeTruthy()
    expect(getByText('Continue')).toBeTruthy()
  })

  it('calls handleChangeCity when continue is pressed with new selection', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const handleChangeCity = jest.fn()
    const onClose = jest.fn()
    const { getByText } = renderWithProviders(
      <CitiesControl
        {...d.citiesControlDefaults}
        handleChangeCity={handleChangeCity}
        onClose={onClose}
      />
    )
    fireEvent.press(getByText('Los Angeles'))
    fireEvent.press(getByText('Continue'))
    expect(handleChangeCity).toHaveBeenCalledWith(2)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not change city when continue is pressed without a new selection', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const handleChangeCity = jest.fn()
    const { getByText } = renderWithProviders(
      <CitiesControl
        {...d.citiesControlDefaults}
        handleChangeCity={handleChangeCity}
      />
    )
    fireEvent.press(getByText('Continue'))
    expect(handleChangeCity).not.toHaveBeenCalled()
  })
})
