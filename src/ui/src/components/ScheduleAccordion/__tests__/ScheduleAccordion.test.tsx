import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ScheduleAccordion } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())

jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('ScheduleAccordion', () => {
  it('renders weekday label', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').scheduleAccordionDefaults
    const { getByText } = renderWithProviders(<ScheduleAccordion {...defaults} />)
    expect(getByText('Monday')).toBeTruthy()
  })

  it('expands schedule lapses when pressed', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').scheduleAccordionDefaults
    const { getByText, UNSAFE_getAllByType } = renderWithProviders(
      <ScheduleAccordion {...defaults} />
    )
    const { TouchableOpacity } = require('react-native')
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[0])
    expect(getByText('9:00 - 22:00')).toBeTruthy()
  })

  it('shows closed label when schedule disabled', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').scheduleAccordionDefaults
    const { getByText, UNSAFE_getAllByType } = renderWithProviders(
      <ScheduleAccordion
        {...defaults}
        schedule={{ enabled: false, lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 22, minute: 0 } }] }}
      />
    )
    const { TouchableOpacity } = require('react-native')
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[0])
    expect(getByText('Closed')).toBeTruthy()
  })
})
