const React = require('react')

const mockState = {
  messagesDefaults: null,
  orderListDefaults: null
}

const renderUiController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

module.exports = {
  renderUiController,
  setMockState: (state) => {
    Object.assign(mockState, state)
  },
  resetMockState: () => {
    mockState.messagesDefaults = null
    mockState.orderListDefaults = null
  },
  getMock: (overrides = {}) => {
    const m6 = require('./m6OrdersComponentsMock')
    const d = require('./m7ReviewsDefaults')

    return {
      ...m6.getMock(),
      Messages: (props) => {
        const UI = props.UIComponent
        if (!UI) return null
        const defaults = mockState.messagesDefaults || d.messagesDefaults
        const { UIComponent, ...rest } = props
        return React.createElement(UI, { ...defaults, ...rest })
      },
      OrderReview: renderUiController(d.reviewOrderDefaults),
      ReviewDriver: renderUiController(d.reviewDriverDefaults),
      ReviewProduct: renderUiController(d.reviewProductsDefaults),
      OrderList: (props) => {
        const UI = props.UIComponent
        if (!UI) return null
        const defaults = mockState.orderListDefaults || d.messageListingDefaults
        const { UIComponent, ...rest } = props
        return React.createElement(UI, { ...defaults, ...rest })
      },
      OrderDetails: renderUiController({
        order: { loading: false, error: null, order: d.reviewOrder },
        messages: { loading: false, messages: [] },
        setMessages: jest.fn(),
        readMessages: jest.fn(),
        messagesReadList: []
      }),
      useBusiness: jest.fn(() => [{ business: { id: 1 } }]),
      ...overrides
    }
  }
}
