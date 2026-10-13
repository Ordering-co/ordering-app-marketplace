import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { useOrder, useSession } from '@components'
import { _retrieveStoreData } from '@ui'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../layouts/SafeAreaViewWrapper', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    SafeAreaViewWrapper: ({ children }: any) => (
      <View testID="layout-safe-area">{children}</View>
    )
  }
})

import Profile from '../Profile'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue([
      {
        auth: true,
        user: { id: 7, name: 'Jane', lastname: 'Doe', email: 'jane@test.com' }
      },
      {}
    ])
    ;(useOrder as jest.Mock).mockReturnValue([
      { options: {} },
      {}
    ])
    ;(_retrieveStoreData as jest.Mock).mockResolvedValue(false)
  })

describe('Profile', () => {
  it('renders nothing when user is not authenticated', () => {
        ;(useSession as jest.Mock).mockReturnValue([
          { auth: false, user: null },
          {}
        ])
        const { queryByTestId } = renderPage(Profile)
        expect(queryByTestId('navbar')).toBeNull()
      })
  
      it('renders profile with user greeting and navigation', () => {
        const handleRemoveAccount = jest.fn()
        const { getByTestId, queryByTestId, navigation } = renderPage(Profile, {
          route: { params: { handleRemoveAccount } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Hi Jane Doe')
        expect(getByTestId('user-profile-controller')).toBeTruthy()
        expect(queryByTestId('support-bubble')).toBeNull()
        fireEvent.press(getByTestId('user-profile-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('UserProfileForm', {})
      })
})

