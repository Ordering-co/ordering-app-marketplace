import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { useEvent, useSession } from '@components'

import { UserProfile } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../SavedCards/useSavedCardsGateway', () => ({
  useSavedCardsGateway: jest.fn(() => ({
    gateway: 'stripe',
    paymethodId: 1,
    isAvailable: false,
    loading: false
  }))
}))

jest.mock('@components', () => require('../../../../../../jest/helpers/m8ProfileComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m8ProfileUiMock').getUiMock())

describe('UserProfile', () => {
  it('renders profile quick actions and rewards section', () => {
    const { getByText } = renderWithProviders(<UserProfile />)
    expect(getByText('My Favorites')).toBeTruthy()
    expect(getByText('Rewards')).toBeTruthy()
    expect(getByText('Cash Wallet')).toBeTruthy()
  })

  it('navigates when favorites quick action is pressed', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <UserProfile {...d.userProfileDefaults} onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByText('My Favorites'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Favorite')
  })

  it('returns to the profile after choosing an address from the quick action', () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <UserProfile {...d.userProfileDefaults} onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByText('Addresses'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('AddressList', { isGoBack: true })
  })

  it('returns to the profile after choosing an address from the account list', () => {
    const { useSavedCardsGateway } = require('../../SavedCards/useSavedCardsGateway')
    useSavedCardsGateway.mockReturnValue({
      gateway: 'stripe',
      paymethodId: 1,
      isAvailable: true,
      loading: false
    })
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <UserProfile {...d.userProfileDefaults} onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByText('Addresses'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('AddressList', { isGoBack: true })
    useSavedCardsGateway.mockReturnValue({
      gateway: 'stripe',
      paymethodId: 1,
      isAvailable: false,
      loading: false
    })
  })

  it('emits logout once the account removal succeeds', async () => {
    const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
    const logout = jest.fn().mockResolvedValue(undefined)
    const emit = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue([
      { auth: true, user: d.sessionUser, token: 'token', loading: false },
      { login: jest.fn(), logout }
    ])
    ;(useEvent as jest.Mock).mockReturnValue([{ emit }])

    renderWithProviders(
      <UserProfile {...d.userProfileDefaults} removeAccountState={{ loading: false, error: null, result: 'OK' }} />
    )

    await waitFor(() => expect(emit).toHaveBeenCalledWith('logout'))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})
