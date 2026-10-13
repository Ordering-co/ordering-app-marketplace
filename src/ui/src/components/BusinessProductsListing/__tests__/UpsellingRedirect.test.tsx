import React from 'react'
import { render } from '@testing-library/react-native'

import { UpsellingRedirect } from '../UpsellingRedirect'

const mockControllerProps = jest.fn()

jest.mock('@components', () => ({
  UpsellingPage: (props) => {
    mockControllerProps(props)
    return null
  }
}))

describe('UpsellingRedirect', () => {
  beforeEach(() => mockControllerProps.mockClear())

  it('loads upselling from the cart upselling endpoint when the cart products are known', () => {
    render(<UpsellingRedirect businessId={1} cartProducts={[{ id: 7 }]} />)
    expect(mockControllerProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ businessId: 1, useSuggestiveUpselling: true })
    )
  })

  it('keeps the business products endpoint without cart products', () => {
    render(<UpsellingRedirect businessId={1} />)
    expect(mockControllerProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ useSuggestiveUpselling: false })
    )
  })
})
