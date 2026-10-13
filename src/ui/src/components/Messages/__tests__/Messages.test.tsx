import '../../../../../../jest/helpers/registerM7NativeMocks'

import React from 'react'

import { Messages } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m7ReviewsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m7ReviewsUiMock').getUiMock())

describe('Messages', () => {
  const m7 = require('../../../../../../jest/helpers/m7ReviewsComponentsMock')
  const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')

  beforeEach(() => {
    m7.resetMockState()
  })

  it('renders chat composer for active orders', () => {
    const d = require('../../../../../../jest/helpers/m7ReviewsDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <Messages orderId={43} messages={d.messagesDefaults.messages} />
    )
    expect(getByText('Write message')).toBeTruthy()
    expect(getByTestId('gifted-chat')).toBeTruthy()
  })

  it('shows disabled chat message when order has ended', () => {
    m7.setMockState({ messagesDefaults: d.messagesEndedDefaults })
    const { getByText } = renderWithProviders(
      <Messages orderId={41} messages={d.messagesEndedDefaults.messages} />
    )
    expect(getByText(/can't send messages/i)).toBeTruthy()
  })
})
