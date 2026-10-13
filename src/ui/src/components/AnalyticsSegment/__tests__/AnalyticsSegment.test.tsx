import '../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'
import { Text } from 'react-native'

import { AnalyticsSegment } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('AnalyticsSegment', () => {
  it('renders children when segment is configured (smoke)', () => {
    const { getByText } = renderWithProviders(
      <AnalyticsSegment>
        <Text>App content</Text>
      </AnalyticsSegment>
    )
    expect(getByText('App content')).toBeTruthy()
  })
})
