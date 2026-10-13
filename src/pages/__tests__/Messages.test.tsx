import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { BackHandler } from 'react-native'

import { useBusiness, useSession } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: {
    franchiseSlug: 'demo-franchise'
  }
}))

const mockReadMessages = jest.fn()

jest.mock('@components', () => {
  const mockOrdering = require('../../../jest/helpers/mockOrdering')
  const React = require('react')
  const { View } = require('react-native')
  return {
    ...mockOrdering,
    OrderDetails: (props: any) => {
      const UI = props.UIComponent
      const order = props.order ?? {
        id: 5,
        business: { name: 'Test Business' },
        driver: { name: 'Test Driver' }
      }
      return (
        <View testID="message-view-order-details">
          <UI
            navigation={props.navigation}
            order={{ order }}
            messages={props.messages ?? []}
            setMessages={jest.fn()}
            readMessages={mockReadMessages}
            messagesReadList={props.messagesReadList ?? []}
            business={props.business}
            driver={props.driver}
            goToBack={props.goToBack}
          />
        </View>
      )
    }
  }
})


import Messages from '../Messages'


let backHandlerCallback: (() => boolean) | null = null
  const removeBackHandler = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    backHandlerCallback = null
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'hardwareBackPress') {
        backHandlerCallback = handler as () => boolean
      }
      return { remove: removeBackHandler }
    })
    ;(useBusiness as jest.Mock).mockReturnValue([
      { business: { id: 12 } }
    ])
    ;(useSession as jest.Mock).mockReturnValue([
      { auth: true },
      {}
    ])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

describe('Messages', () => {
  it('renders message listing with refresh and navigation', () => {
        const { getByTestId, navigation } = renderPage(Messages)
        expect(getByTestId('navbar-title').props.children).toBe('Messages')
        expect(getByTestId('message-listing-controller')).toBeTruthy()
        fireEvent.press(getByTestId('safe-area-refresh'))
        fireEvent.press(getByTestId('message-listing-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('MessageView', { orderId: 1 })
      })
  
      it('goes back only when navigation can go back', () => {
        const { getByTestId, navigation } = renderPage(Messages, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).not.toHaveBeenCalled()
      })
})

