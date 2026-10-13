import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { UserDetails } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m8ProfileComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m8ProfileUiMock').getUiMock())

describe('UserDetails', () => {
  it('renders customer details header and user info', () => {
    const { getByText } = renderWithProviders(<UserDetails />)
    expect(getByText('Customer Details')).toBeTruthy()
    expect(getByText(/Jane/)).toBeTruthy()
    expect(getByText('jane@test.com')).toBeTruthy()
  })

  it('shows saved recipient data and opens the fields from Edit', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const toggleIsEdit = jest.fn()
    const { getByText, queryByTestId } = renderWithProviders(
      <UserDetails
        {...d.userDetailsDefaults}
        mawejaCheckout
        isUserDetailsEdit={false}
        toggleIsEdit={toggleIsEdit}
      />
    )
    expect(getByText('Recipient')).toBeTruthy()
    expect(getByText('Edit')).toBeTruthy()
    expect(getByText('Jane Doe')).toBeTruthy()
    expect(getByText('jane@test.com')).toBeTruthy()
    expect(queryByTestId('user-form-details-ui-stub')).toBeNull()
    fireEvent.press(getByText('Edit'))
    expect(toggleIsEdit).toHaveBeenCalled()
  })

  it('shows Close and the fields while the recipient is being edited', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <UserDetails
        {...d.userDetailsDefaults}
        mawejaCheckout
        isEdit
      />
    )
    expect(getByText('Close')).toBeTruthy()
    expect(getByTestId('user-form-details-ui-stub')).toBeTruthy()
  })

  it('toggles edit mode when pencil is pressed', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const toggleIsEdit = jest.fn()
    const { getByTestId } = renderWithProviders(
      <UserDetails {...d.userDetailsDefaults} toggleIsEdit={toggleIsEdit} />
    )
    fireEvent.press(getByTestId('mci-icon'))
    expect(toggleIsEdit).toHaveBeenCalled()
  })
})
