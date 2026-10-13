import { parseDriverTipOptions } from '../parseDriverTipOptions'

describe('parseDriverTipOptions', () => {
  it('parses a JSON array string', () => {
    expect(parseDriverTipOptions('[10,15,20]')).toEqual([10, 15, 20])
    expect(parseDriverTipOptions('[]')).toEqual([])
  })

  it('keeps an already parsed array', () => {
    expect(parseDriverTipOptions([10, 15])).toEqual([10, 15])
  })

  it('returns an empty list for malformed JSON', () => {
    expect(parseDriverTipOptions('[10,')).toEqual([])
    expect(parseDriverTipOptions('{')).toEqual([])
    expect(parseDriverTipOptions('<html>oops</html>')).toEqual([])
  })

  it('returns an empty list for missing or non-list values', () => {
    expect(parseDriverTipOptions(null)).toEqual([])
    expect(parseDriverTipOptions(undefined)).toEqual([])
    expect(parseDriverTipOptions('')).toEqual([])
    expect(parseDriverTipOptions('null')).toEqual([])
    expect(parseDriverTipOptions('"nope"')).toEqual([])
    expect(parseDriverTipOptions('{"a":1}')).toEqual([])
  })
})
