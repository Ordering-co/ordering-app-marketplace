import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { Alert } from 'react-native'
import { act, fireEvent } from '@testing-library/react-native'

import { PendingCartNotice } from '../PendingCartNotice'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockShowToast = jest.fn()

jest.mock('@components', () => ({
  useLanguage: () => [null, (_key: string, fallback: string) => fallback],
  useToast: () => [null, { showToast: mockShowToast }],
  ToastType: { Success: 'success', Error: 'error' }
}))

const genericMessage = /Your order is being processed/
const order = { uuid: 'order-uuid', id: 77 }

describe('PendingCartNotice', () => {
  let alertSpy: jest.SpyInstance

  const renderNotice = (props: any = {}) => {
    const handleReleasePendingCart = jest.fn().mockResolvedValue({ outcome: 'released' })
    const onReleased = jest.fn()
    const onOrderCreated = jest.fn()
    const utils = renderWithProviders(
      <PendingCartNotice
        paymethodName='Mercado Pago'
        isPendingCartReleasable
        handleReleasePendingCart={handleReleasePendingCart}
        onReleased={onReleased}
        onOrderCreated={onOrderCreated}
        {...props}
      />
    )
    return { ...utils, handleReleasePendingCart, onReleased, onOrderCreated }
  }

  /** Presses a button of the dialog opened last */
  const pressDialogButton = async (text: string) => {
    const buttons = alertSpy.mock.calls[alertSpy.mock.calls.length - 1][2]
    await act(async () => {
      await buttons.find((button: any) => button.text === text).onPress?.()
    })
  }

  const releaseWith = async (response: any) => {
    const handleReleasePendingCart = typeof response === 'function'
      ? response
      : jest.fn().mockResolvedValue(response)
    const utils = renderNotice({ handleReleasePendingCart })
    fireEvent.press(utils.getByText('Cancel payment attempt'))
    await pressDialogButton('Yes, cancel')
    return utils
  }

  beforeEach(() => {
    mockShowToast.mockClear()
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    alertSpy.mockRestore()
  })

  it('keeps the generic pending message when the cart is not releasable', () => {
    const { getByText, queryByText } = renderNotice({ isPendingCartReleasable: false })
    expect(getByText(genericMessage)).toBeTruthy()
    expect(queryByText('Cancel payment attempt')).toBeNull()
  })

  it('keeps the generic pending message when the controller has no release handler', () => {
    const { getByText, queryByText } = renderNotice({ handleReleasePendingCart: undefined })
    expect(getByText(genericMessage)).toBeTruthy()
    expect(queryByText('Cancel payment attempt')).toBeNull()
  })

  it('hides the release option for a cart placed from this screen', () => {
    const { getByText, queryByText } = renderNotice({ isPlacedHere: true })
    expect(getByText(genericMessage)).toBeTruthy()
    expect(queryByText('Cancel payment attempt')).toBeNull()
  })

  it('shows the generic pending message as a notice on maweja', () => {
    const { getByText, queryByText } = renderNotice({ isMaweja: true, isPendingCartReleasable: false })
    expect(getByText(genericMessage)).toBeTruthy()
    expect(queryByText('Cancel payment attempt')).toBeNull()
  })

  it.each([false, true])('names the paymethod and offers to cancel the attempt (maweja: %s)', (isMaweja) => {
    const { getByText, queryByText } = renderNotice({ isMaweja })
    expect(getByText('Your payment with Mercado Pago is still pending')).toBeTruthy()
    expect(getByText('If you didn\'t complete the payment, cancel the attempt to pay again.')).toBeTruthy()
    expect(getByText('Cancel payment attempt')).toBeTruthy()
    expect(queryByText(genericMessage)).toBeNull()
  })

  it('asks for confirmation, with the warning to close the gateway page, before releasing', async () => {
    const { getByText, handleReleasePendingCart } = renderNotice()
    fireEvent.press(getByText('Cancel payment attempt'))

    expect(handleReleasePendingCart).not.toHaveBeenCalled()
    const [title, message, buttons] = alertSpy.mock.calls[0]
    expect(title).toBe('Cancel the payment attempt?')
    expect(message).toContain('If you already paid with Mercado Pago, nothing is cancelled')
    expect(message).toContain('If you left the Mercado Pago page open, close it')
    expect(buttons.map((button: any) => button.text)).toEqual(['Keep waiting', 'Yes, cancel'])

    await pressDialogButton('Keep waiting')
    expect(handleReleasePendingCart).not.toHaveBeenCalled()

    await pressDialogButton('Yes, cancel')
    expect(handleReleasePendingCart).toHaveBeenCalledTimes(1)
  })

  it('disables the button and shows the verifying label while releasing', () => {
    const { getByText, queryByText, handleReleasePendingCart } = renderNotice({ releasingPendingCart: true })
    expect(queryByText('Cancel payment attempt')).toBeNull()
    fireEvent.press(getByText('Verifying with Mercado Pago…'))
    expect(alertSpy).not.toHaveBeenCalled()
    expect(handleReleasePendingCart).not.toHaveBeenCalled()
  })

  it('notifies the checkout when the cart was released', async () => {
    const { onReleased, onOrderCreated } = await releaseWith({ outcome: 'released' })
    expect(onReleased).toHaveBeenCalledTimes(1)
    expect(onOrderCreated).not.toHaveBeenCalled()
    expect(mockShowToast).not.toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledTimes(1)
  })

  it('goes to the order when an approved payment was found', async () => {
    const { onReleased, onOrderCreated } = await releaseWith({ outcome: 'order_created', order })
    expect(mockShowToast).toHaveBeenCalledWith('success', 'We found your payment with Mercado Pago and created your order.')
    expect(onOrderCreated).toHaveBeenCalledWith(order)
    expect(onReleased).not.toHaveBeenCalled()
  })

  it('explains that the cart cannot be released yet when it is still pending', async () => {
    const { onReleased, onOrderCreated } = await releaseWith({ outcome: 'still_pending' })
    const [title, message, buttons] = alertSpy.mock.calls[1]
    expect(title).toBe('It can\'t be cancelled yet')
    expect(message).toContain('Mercado Pago has a payment in process')
    expect(buttons.map((button: any) => button.text)).toEqual(['Accept'])
    expect(onReleased).not.toHaveBeenCalled()
    expect(onOrderCreated).not.toHaveBeenCalled()
  })

  it('offers a retry when the request fails', async () => {
    const handleReleasePendingCart = jest.fn()
      .mockRejectedValueOnce(new Error('Network request failed'))
      .mockResolvedValueOnce({ outcome: 'error' })
      .mockResolvedValueOnce({ outcome: 'released' })
    const { onReleased } = await releaseWith(handleReleasePendingCart)

    const [title, message, buttons] = alertSpy.mock.calls[1]
    expect(title).toBe('We couldn\'t connect')
    expect(message).toBe('Check your connection and try again. Your cart has not changed.')
    expect(buttons.map((button: any) => button.text)).toEqual(['Close', 'Retry'])

    await pressDialogButton('Retry')
    expect(alertSpy).toHaveBeenCalledTimes(3)
    expect(alertSpy.mock.calls[2][0]).toBe('We couldn\'t connect')

    await pressDialogButton('Retry')
    expect(handleReleasePendingCart).toHaveBeenCalledTimes(3)
    expect(onReleased).toHaveBeenCalledTimes(1)
  })

  it('does nothing when the controller ignores the release', async () => {
    const { onReleased, onOrderCreated } = await releaseWith(undefined)
    expect(onReleased).not.toHaveBeenCalled()
    expect(onOrderCreated).not.toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledTimes(1)
  })

  it('releases with the latest handler when the dialog outlives a render', async () => {
    const staleHandler = jest.fn().mockResolvedValue({ outcome: 'released' })
    const latestHandler = jest.fn().mockResolvedValue({ outcome: 'released' })
    const { getByText, rerender } = renderNotice({ handleReleasePendingCart: staleHandler })
    fireEvent.press(getByText('Cancel payment attempt'))

    rerender(
      <PendingCartNotice paymethodName='Mercado Pago' isPendingCartReleasable handleReleasePendingCart={latestHandler} />
    )
    await pressDialogButton('Yes, cancel')

    expect(staleHandler).not.toHaveBeenCalled()
    expect(latestHandler).toHaveBeenCalledTimes(1)
  })

  it('falls back to a generic paymethod name', () => {
    const { getByText } = renderNotice({ paymethodName: undefined })
    expect(getByText('Your payment with the payment gateway is still pending')).toBeTruthy()
  })
})
