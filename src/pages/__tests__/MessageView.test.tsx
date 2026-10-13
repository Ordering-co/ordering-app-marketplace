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


import MessageView from '../MessageView'


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

describe('MessageView', () => {
  it('renders business chat with navbar and close handler', () => {
        const { getByTestId, navigation } = renderPage(MessageView, {
          route: {
            params: {
              order: { id: 8, business: { name: 'Pizza Place' }, driver: { name: 'Sam' } },
              business: true,
              driver: false
            }
          }
        })
        expect(getByTestId('message-view-order-details')).toBeTruthy()
        expect(getByTestId('navbar-title').props.children).toBe('Pizza Place')
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).toHaveBeenCalled()
        fireEvent.press(getByTestId('messages-close'))
        expect(navigation.goBack).toHaveBeenCalledTimes(2)
      })
  
      it('renders driver chat when driver tab is active', () => {
        const { getByTestId } = renderPage(MessageView, {
          route: {
            params: {
              order: { id: 9, business: { name: 'Burger Co' }, driver: { name: 'Alex' } },
              business: false,
              driver: true
            }
          }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Alex')
        expect(getByTestId('navbar-subtitle').props.children).toBe('Driver')
      })
  
      it('reads messages when order changes and handles hardware back', () => {
        const { unmount, navigation } = renderPage(MessageView, {
          route: {
            params: {
              orderId: 10,
              order: { id: 10, business: { name: 'Cafe' }, driver: { name: 'Lee' } }
            }
          }
        })
        expect(mockReadMessages).toHaveBeenCalled()
        expect(backHandlerCallback).toBeTruthy()
        backHandlerCallback?.()
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
        unmount()
        expect(removeBackHandler).toHaveBeenCalled()
      })
})

