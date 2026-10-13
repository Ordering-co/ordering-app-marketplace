import { handleCheckoutHardwareBack } from '../handleCheckoutHardwareBack'

describe('handleCheckoutHardwareBack', () => {
  it('closes an open paypal webview first', () => {
    const closePaypalWebview = jest.fn()
    const leave = jest.fn()
    const consumed = handleCheckoutHardwareBack({
      isPaypalWebviewOpen: true,
      closePaypalWebview,
      cart: { business_id: null, uuid: 'gift-1' },
      leave
    })
    expect(consumed).toBe(true)
    expect(closePaypalWebview).toHaveBeenCalled()
    expect(leave).not.toHaveBeenCalled()
  })

  it('leaves a gift checkout immediately without clearing', () => {
    const leave = jest.fn()
    const consumed = handleCheckoutHardwareBack({
      isPaypalWebviewOpen: false,
      closePaypalWebview: jest.fn(),
      cart: { business_id: null, uuid: 'gift-1' },
      leave
    })
    expect(consumed).toBe(true)
    expect(leave).toHaveBeenCalled()
  })

  it('does not consume food-cart back', () => {
    const consumed = handleCheckoutHardwareBack({
      isPaypalWebviewOpen: false,
      closePaypalWebview: jest.fn(),
      cart: { business_id: 4, uuid: 'food-1' },
      leave: jest.fn()
    })
    expect(consumed).toBe(false)
  })
})
