const React = require('react')

const renderUiController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

module.exports = {
  renderUiController,
  getMock: (overrides = {}) => {
    const m5 = require('./m5CheckoutComponentsMock')
    const d = require('./m6OrdersDefaults')

    const orderActions = {
      reorder: jest.fn().mockResolvedValue({ error: false, result: { uuid: 'cart-1', business_id: 1, business: d.sampleOrder.business } }),
      changeType: jest.fn(),
      changeMoment: jest.fn(),
      setStateValues: jest.fn()
    }

    return {
      ...m5.getMock(),
      OrderList: renderUiController(d.ordersOptionDefaults),
      OrderDetails: renderUiController(d.orderDetailsDefaults),
      SingleOrderCard: renderUiController(d.singleOrderCardDefaults),
      MultiOrdersDetails: renderUiController(d.multiOrdersDetailsDefaults),
      MultiCheckout: renderUiController(d.multiCheckoutDefaults),
      MultiCartCreate: renderUiController(d.multiCartDefaults),
      MultiCartsPaymethodsAndWallets: renderUiController(d.multiCartsPaymethodsDefaults),
      MomentOption: renderUiController(d.momentOptionDefaults),
      OrderTypeControl: renderUiController(d.orderTypeSelectorDefaults),
      Cart: renderUiController(d.orderSummaryDefaults),
      useOrder: jest.fn(() => [
        {
          loading: false,
          options: { type: 1, moment: null, address_id: 1 },
          carts: { 'businessId:1': require('./m5CheckoutDefaults').sampleCart },
          reorder: { loading: false, error: null, result: null }
        },
        orderActions
      ]),
      useToast: jest.fn(() => [, { showToast: jest.fn() }]),
      ...overrides
    }
  }
}
