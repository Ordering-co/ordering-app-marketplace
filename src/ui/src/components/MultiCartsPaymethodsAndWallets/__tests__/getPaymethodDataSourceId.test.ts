import { getPaymethodDataSourceId } from '../getPaymethodDataSourceId'

describe('getPaymethodDataSourceId', () => {
  it('returns source_id from a JSON string', () => {
    expect(getPaymethodDataSourceId('{"source_id":"pm_123"}')).toBe('pm_123')
  })

  it('returns null for malformed JSON instead of throwing', () => {
    expect(getPaymethodDataSourceId('{not-json')).toBeNull()
    expect(getPaymethodDataSourceId('<html>oops</html>')).toBeNull()
  })

  it('returns null when source_id is missing', () => {
    expect(getPaymethodDataSourceId('{"ok":true}')).toBeNull()
    expect(getPaymethodDataSourceId('{}')).toBeNull()
    expect(getPaymethodDataSourceId('null')).toBeNull()
  })

  it('returns null for non-string payloads', () => {
    expect(getPaymethodDataSourceId(undefined)).toBeNull()
    expect(getPaymethodDataSourceId(null)).toBeNull()
    expect(getPaymethodDataSourceId({ source_id: 'pm_123' })).toBeNull()
  })
})
