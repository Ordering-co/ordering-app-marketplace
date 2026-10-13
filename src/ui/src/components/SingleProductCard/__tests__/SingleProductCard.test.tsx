import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useSession } from '@components'

import { SingleProductCard } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('SingleProductCard', () => {
  it('renders product name', () => {
    const { getByText } = renderWithProviders(
      <SingleProductCard product={{ id: 100, name: 'Cheese Slice', price: 5 }} />
    )
    expect(getByText('Cheese Slice')).toBeTruthy()
  })

  it('calls onProductClick when pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').singleProductCardDefaults
    defaults.onProductClick.mockClear()
    const { getByText } = renderWithProviders(
      <SingleProductCard product={defaults.product} />
    )
    fireEvent.press(getByText('Cheese Slice'))
    expect(defaults.onProductClick).toHaveBeenCalled()
  })

  it('redirects to login when favorite tapped while logged out', () => {
    ;(useSession as jest.Mock).mockReturnValueOnce([{ auth: false, user: null, token: null }, {}])
    const navigation = { navigate: jest.fn() }
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').singleProductCardDefaults
    const { UNSAFE_getAllByType } = renderWithProviders(
      <SingleProductCard
        product={defaults.product}
        navigation={navigation}
        handleFavoriteProduct={jest.fn()}
      />
    )
    const { TouchableOpacity } = require('react-native')
    const buttons = UNSAFE_getAllByType(TouchableOpacity)
    if (buttons.length > 1) {
      fireEvent.press(buttons[1])
    }
    expect(navigation.navigate).toHaveBeenCalledWith('Login')
  })
})
