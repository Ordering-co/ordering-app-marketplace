import '../../../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { HomeHeader } from '../HomeHeader'
import { renderWithProviders } from '../../../../../../../../jest/helpers/renderWithProviders'
import { resolveThemeLogo } from '@/utils/logoSource'

jest.mock('@/utils/logoSource', () => ({
  resolveThemeLogo: jest.fn(() => 4)
}))

jest.mock('@components', () => require('../../../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('Maweja HomeHeader', () => {
  it('opens address, search, notifications, and cart from the homepage header', () => {
    const navigation = { navigate: jest.fn() }
    const onHandleCart = jest.fn()
    const { getByTestId } = renderWithProviders(
      <HomeHeader
        navigation={navigation}
        isGuestUser={false}
        onHandleCart={onHandleCart}
        orderTypeValue={1}
        showBusinessSearchMap
      />
    )

    fireEvent.press(getByTestId('maweja-address'))
    fireEvent.press(getByTestId('maweja-search'))
    fireEvent.press(getByTestId('maweja-notifications'))
    fireEvent.press(getByTestId('maweja-cart'))
    fireEvent.press(getByTestId('maweja-moment'))

    expect(getByTestId('maweja-header-logo').props.source).toBe(4)
    expect(resolveThemeLogo).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('AddressList', { isFromBusinesses: true })
    expect(navigation.navigate).toHaveBeenCalledWith('BusinessSearch')
    expect(navigation.navigate).toHaveBeenCalledWith('Notifications')
    expect(navigation.navigate).toHaveBeenCalledWith('MomentOption')
    expect(onHandleCart).toHaveBeenCalled()
  })
})
