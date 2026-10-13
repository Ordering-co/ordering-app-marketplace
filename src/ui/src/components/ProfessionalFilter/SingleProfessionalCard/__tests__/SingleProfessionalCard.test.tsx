import '../../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../../shared', () => require('../../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { SingleProfessionalCard } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('SingleProfessionalCard', () => {
  it('renders professional name and photo', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <SingleProfessionalCard {...d.singleProfessionalCardDefaults} />
    )
    expect(getByText('Alice Smith')).toBeTruthy()
    expect(getByTestId('fast-image')).toBeTruthy()
  })

  it('calls handleProfessionalClick when card is pressed', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const handleProfessionalClick = jest.fn()
    const { getByText } = renderWithProviders(
      <SingleProfessionalCard
        {...d.singleProfessionalCardDefaults}
        handleProfessionalClick={handleProfessionalClick}
      />
    )
    fireEvent.press(getByText('Alice Smith'))
    expect(handleProfessionalClick).toHaveBeenCalledWith(d.sampleProfessional)
  })
})
