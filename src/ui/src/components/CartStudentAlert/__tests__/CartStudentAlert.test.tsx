import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useOrder, useSchoolStudents, useSelectedStudent } from '@components'

import { CartStudentAlert } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('CartStudentAlert', () => {
  it('opens conflict modal for mismatched student products', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').cartStudentAlertDefaults
    const { getByText } = renderWithProviders(
      <CartStudentAlert cart={defaults.cart} />
    )
    expect(getByText(/Items not suitable for student/i)).toBeTruthy()
    expect(getByText('Cheese Slice')).toBeTruthy()
  })

  it('keeps items when keep is pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').cartStudentAlertDefaults
    const { getByText, queryByText } = renderWithProviders(
      <CartStudentAlert cart={defaults.cart} />
    )
    fireEvent.press(getByText('Keep them'))
    expect(queryByText(/Items not suitable for student/i)).toBeNull()
  })

  it('removes conflicting products', async () => {
    const removeProduct = jest.fn().mockResolvedValue()
    ;(useOrder as jest.Mock).mockReturnValue([
      { carts: {}, options: { type: 1 } },
      { removeProduct }
    ])
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').cartStudentAlertDefaults
    const { getByText } = renderWithProviders(
      <CartStudentAlert cart={defaults.cart} />
    )
    fireEvent.press(getByText('Remove these items'))
    expect(removeProduct).toHaveBeenCalled()
  })
})
