import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { SearchBar } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar {...d.searchBarDefaults} />
    )
    expect(getByPlaceholderText('Search')).toBeTruthy()
  })

  it('calls onSearch when text changes', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const onSearch = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar {...d.searchBarDefaults} onSearch={onSearch} />
    )
    fireEvent.changeText(getByPlaceholderText('Search'), 'pizza')
    expect(onSearch).toHaveBeenCalledWith('pizza')
  })

  it('debounces search when lazyLoad is enabled', () => {
    jest.useFakeTimers()
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const onSearch = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar {...d.searchBarDefaults} lazyLoad onSearch={onSearch} />
    )
    fireEvent.changeText(getByPlaceholderText('Search'), 'burger')
    expect(onSearch).not.toHaveBeenCalled()
    jest.advanceTimersByTime(750)
    expect(onSearch).toHaveBeenCalledWith('burger')
    jest.useRealTimers()
  })
})
