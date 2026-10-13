import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { Alert } from 'react-native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'

import { useEvent, useSession } from '@components'

import { UserFormDetailsUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m8ProfileComponentsMock').getMock())
jest.mock('@ui', () => ({
  ...require('../../../../../../jest/helpers/m8ProfileUiMock').getUiMock(),
  OAlertOriginal: jest.requireActual('@/ui/src/components/shared/OAlertOriginal').default
}))

describe('UserFormDetails', () => {
  it('renders profile form fields in edit mode', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const { getByText } = renderWithProviders(
      <UserFormDetailsUI {...d.userFormDetailsUIDefaults} />
    )
    expect(getByText('Update')).toBeTruthy()
  })

  it('keeps the Update button visible without changes by default', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const formState = { ...d.userFormDetailsUIDefaults.formState, changes: {} }
    const { getByText } = renderWithProviders(
      <UserFormDetailsUI {...d.userFormDetailsUIDefaults} formState={formState} />
    )
    expect(getByText('Update')).toBeTruthy()
  })

  it('hides the Update button without changes when showUpdateButtonOnlyWithChanges is set', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const formState = { ...d.userFormDetailsUIDefaults.formState, changes: {} }
    const { queryByText } = renderWithProviders(
      <UserFormDetailsUI {...d.userFormDetailsUIDefaults} formState={formState} showUpdateButtonOnlyWithChanges />
    )
    expect(queryByText('Update')).toBeNull()
  })

  it('shows the Update button with changes when showUpdateButtonOnlyWithChanges is set', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const { getByText } = renderWithProviders(
      <UserFormDetailsUI {...d.userFormDetailsUIDefaults} showUpdateButtonOnlyWithChanges />
    )
    expect(getByText('Update')).toBeTruthy()
  })

  it('hides the Update button when hideUpdateButton is set', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const { queryByText } = renderWithProviders(
      <UserFormDetailsUI {...d.userFormDetailsUIDefaults} hideUpdateButton />
    )
    expect(queryByText('Update')).toBeNull()
  })

  it('emits logout after the account is removed so navigation resets', async () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const calls: string[] = []
    const logout = jest.fn(async () => { calls.push('logout') })
    const emit = jest.fn((name: string) => { calls.push(name) })
    ;(useSession as jest.Mock).mockReturnValue([
      { auth: true, user: d.sessionUser, token: 'token', loading: false },
      { login: jest.fn(), logout }
    ])
    ;(useEvent as jest.Mock).mockReturnValue([{ emit }])
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    const handleRemoveAccount = jest.fn().mockResolvedValue('OK')

    const { getByText } = renderWithProviders(
      <UserFormDetailsUI {...d.userFormDetailsUIDefaults} handleRemoveAccount={handleRemoveAccount} />
    )

    fireEvent.press(getByText('Remove account'))
    await waitFor(() => expect(alertSpy).toHaveBeenCalled())
    const buttons = alertSpy.mock.calls[0][2] as any[]
    await act(async () => {
      await buttons.find((button) => button.text === 'Accept').onPress()
    })

    expect(handleRemoveAccount).toHaveBeenCalledWith(d.sessionUser.id)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('logout')
    expect(calls).toEqual(['logout', 'logout'])
    alertSpy.mockRestore()
  })
})
