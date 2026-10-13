import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'

import { CheckoutSectionOrder, MawejaArticles, MawejaCartNotice } from '../layouts/Maweja'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const section = (label: string) => <Text>{label}</Text>

describe('Maweja checkout sections', () => {
  it('keeps the original checkout order', () => {
    const { toJSON } = renderWithProviders(
      <CheckoutSectionOrder
        isMaweja={false}
        business={section('business')}
        address={section('address')}
        articles={section('articles')}
        customer={section('customer')}
        beforePay={section('before')}
        payments={section('payments')}
        wallet={section('wallet')}
        afterWallet={section('after')}
      />
    )
    const text = JSON.stringify(toJSON())
    expect(text.indexOf('business')).toBeLessThan(text.indexOf('articles'))
    expect(text.indexOf('payments')).toBeLessThan(text.indexOf('wallet'))
    expect(text.includes('summary')).toBe(false)
  })

  it('moves articles, recipient, and address ahead of payment on maweja', () => {
    const { toJSON } = renderWithProviders(
      <CheckoutSectionOrder
        isMaweja
        business={section('business')}
        address={section('address')}
        articles={section('articles')}
        customer={section('customer')}
        beforePay={section('before')}
        payments={section('payments')}
        wallet={section('wallet')}
        afterWallet={section('after')}
      />
    )
    const text = JSON.stringify(toJSON())
    expect(text.indexOf('articles')).toBeLessThan(text.indexOf('business'))
    expect(text.indexOf('business')).toBeLessThan(text.indexOf('customer'))
    expect(text.indexOf('customer')).toBeLessThan(text.indexOf('address'))
    expect(text.indexOf('address')).toBeLessThan(text.indexOf('wallet'))
    expect(text.indexOf('wallet')).toBeLessThan(text.indexOf('payments'))
    expect(text.includes('summary')).toBe(false)
  })

  it('shows an article row with quantity and price', () => {
    const { getByText } = renderWithProviders(
      <MawejaArticles
        title="Articles (1)"
        businessName="Maweja"
        parsePrice={(value: number) => `$${value}`}
        products={[{ id: 1, name: 'Buffalo Ranch Chicken', quantity: 1, price: 10.35, total: 10.35 }]}
      />
    )
    expect(getByText('Articles (1)')).toBeTruthy()
    expect(getByText('Buffalo Ranch Chicken')).toBeTruthy()
    expect(getByText('1 x $10.35')).toBeTruthy()
    expect(getByText('$10.35')).toBeTruthy()
  })

  it('adds products from the menu and opens the cart to edit', () => {
    const onAddProducts = jest.fn()
    const onEditCart = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <MawejaArticles
        title="Articles (1)"
        businessName="Maweja"
        addLabel="Add more products"
        parsePrice={(value: number) => `$${value}`}
        onAddProducts={onAddProducts}
        onEditCart={onEditCart}
        products={[{ id: 1, name: 'Buffalo Ranch Chicken', quantity: 1, price: 10.35, total: 10.35 }]}
      />
    )
    fireEvent.press(getByText('Buffalo Ranch Chicken'))
    expect(onEditCart).toHaveBeenCalled()
    fireEvent.press(getByTestId('maweja-checkout-add-products'))
    expect(onAddProducts).toHaveBeenCalled()
  })

  it('shows a checkout warning as a notice', () => {
    const { getByText } = renderWithProviders(
      <MawejaCartNotice message="Please, select a payment method to place order." />
    )
    expect(getByText('Please, select a payment method to place order.')).toBeTruthy()
  })
})
