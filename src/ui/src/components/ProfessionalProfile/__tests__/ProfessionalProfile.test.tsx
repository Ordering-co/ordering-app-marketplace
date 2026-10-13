import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ProfessionalProfile } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('ProfessionalProfile', () => {
  it('renders professional name and schedule section', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <ProfessionalProfile {...d.professionalProfileDefaults} />
    )
    expect(getByText('Alice Smith')).toBeTruthy()
    expect(getByText('Schedule')).toBeTruthy()
    expect(getByTestId('calendar-picker')).toBeTruthy()
  })

  it('selects professional when book is pressed', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const handleChangeProfessionalSelected = jest.fn()
    const onClose = jest.fn()
    const { getByText } = renderWithProviders(
      <ProfessionalProfile
        {...d.professionalProfileDefaults}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        onClose={onClose}
      />
    )
    fireEvent.press(getByText('Book'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(d.sampleProfessional)
    expect(onClose).toHaveBeenCalled()
  })
})
