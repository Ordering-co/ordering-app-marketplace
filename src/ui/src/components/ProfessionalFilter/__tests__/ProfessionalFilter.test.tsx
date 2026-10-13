import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('@ui', () => require('../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

jest.mock('../SingleProfessionalCard', () => ({
  SingleProfessionalCard: ({ professional, handleProfessionalClick }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native')
    return (
      <TouchableOpacity onPress={() => handleProfessionalClick?.(professional)}>
        <View testID="single-professional-card-stub">
          <Text>{professional?.name} {professional?.lastname}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ProfessionalFilter } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('ProfessionalFilter', () => {
  it('renders any professional option and cards (smoke)', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <ProfessionalFilter {...d.professionalFilterDefaults} />
    )
    expect(getByText('Any professional member')).toBeTruthy()
    expect(getByText('Alice Smith')).toBeTruthy()
  })

  it('clears selection when any professional is pressed', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const handleChangeProfessionalSelected = jest.fn()
    const { getByText } = renderWithProviders(
      <ProfessionalFilter
        {...d.professionalFilterDefaults}
        professionalSelected={d.sampleProfessional}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
      />
    )
    fireEvent.press(getByText('Any professional member'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(null)
  })
})
