import { parseReservationSetting } from '../parseReservationSetting'

describe('parseReservationSetting', () => {
  it('parses a valid reservation setting object', () => {
    expect(parseReservationSetting('{"allow_preorder_reservation":true}')).toEqual({
      allow_preorder_reservation: true
    })
  })

  it('keeps an already parsed object', () => {
    const setting = { allow_preorder_reservation: false }
    expect(parseReservationSetting(setting)).toEqual(setting)
  })

  it('returns an empty object for missing, empty, or invalid JSON', () => {
    expect(parseReservationSetting(undefined)).toEqual({})
    expect(parseReservationSetting(null)).toEqual({})
    expect(parseReservationSetting('')).toEqual({})
    expect(parseReservationSetting('{not-json')).toEqual({})
    expect(parseReservationSetting('<html>oops</html>')).toEqual({})
  })

  it('returns an empty object for non-object JSON', () => {
    expect(parseReservationSetting('[]')).toEqual({})
    expect(parseReservationSetting('"nope"')).toEqual({})
  })
})
