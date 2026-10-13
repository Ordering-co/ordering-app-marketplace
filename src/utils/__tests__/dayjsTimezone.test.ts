import dayjs from 'dayjs'

import { businessEndOfDay, zoneOffsetMinutes } from '../dayjsTimezone'

const NY = 'America/New_York'

const wallClockIn = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(date).replace('24:', '00:')

describe('zoneOffsetMinutes', () => {
  it('resolves standard time', () => {
    expect(zoneOffsetMinutes(new Date('2024-01-15T12:00:00Z'), NY)).toBe(-300)
  })

  it('resolves daylight saving time', () => {
    expect(zoneOffsetMinutes(new Date('2024-06-01T12:00:00Z'), NY)).toBe(-240)
  })

  it('returns null instead of throwing for an unusable zone', () => {
    expect(zoneOffsetMinutes(new Date(), 'Not/A_Real_Zone')).toBeNull()
  })
})

describe('patched instance .tz()', () => {
  it('shifts the wall clock into the zone', () => {
    expect(dayjs('2024-01-15T12:00:00Z').tz(NY).format('HH:mm')).toBe('07:00')
  })

  it('tracks daylight saving', () => {
    expect(dayjs('2024-06-01T18:30:00Z').tz(NY).format('HH:mm')).toBe('14:30')
  })

  it('keeps the business day when device and business straddle midnight', () => {
    expect(dayjs('2024-06-02T03:30:00Z').tz(NY).format('YYYY-MM-DD')).toBe('2024-06-01')
  })

  it('leaves the instant untouched', () => {
    const iso = '2024-06-01T18:30:00.000Z'
    expect(dayjs(iso).tz(NY).toDate().toISOString()).toBe(iso)
  })
})

describe('businessEndOfDay', () => {
  it('lands on the last minute of the day in the business zone', () => {
    expect(wallClockIn(businessEndOfDay(NY, 0), NY)).toBe('23:59:59')
  })

  it('stays on the last minute across a daylight saving change', () => {
    // 90 days out crosses at least one transition from any point in the year
    expect(wallClockIn(businessEndOfDay(NY, 90), NY)).toBe('23:59:59')
  })
})

describe('patched static dayjs.tz(string, format, zone)', () => {
  it('resolves the reported case', () => {
    expect(
      (dayjs as any).tz('2026-08-19 20:15', 'YYYY-MM-DD HH:mm', 'Asia/Dubai')
        .utc().format('YYYY-MM-DD HH:mm:ss')
    ).toBe('2026-08-19 16:15:00')
  })

  it('does not drift with the current time', () => {
    const once = (dayjs as any).tz('2026-08-19 20:15', 'YYYY-MM-DD HH:mm', 'Asia/Dubai').valueOf()
    const twice = (dayjs as any).tz('2026-08-19 20:15', 'YYYY-MM-DD HH:mm', 'Asia/Dubai').valueOf()
    expect(once).toBe(twice)
    expect(new Date(once).toISOString()).toBe('2026-08-19T16:15:00.000Z')
  })

  it('uses the offset in effect on that date', () => {
    expect((dayjs as any).tz('2024-01-15 14:30', 'YYYY-MM-DD HH:mm', NY).toDate().toISOString())
      .toBe('2024-01-15T19:30:00.000Z')
    expect((dayjs as any).tz('2024-06-01 14:30', 'YYYY-MM-DD HH:mm', NY).toDate().toISOString())
      .toBe('2024-06-01T18:30:00.000Z')
  })

  it('accepts the ISO separator and seconds', () => {
    expect((dayjs as any).tz('2026-08-19T20:15:30', 'YYYY-MM-DD HH:mm:ss', 'Asia/Dubai').toDate().toISOString())
      .toBe('2026-08-19T16:15:30.000Z')
  })

  it('reads a bare date as midnight in the zone', () => {
    expect((dayjs as any).tz('2026-08-19', 'YYYY-MM-DD', 'Asia/Dubai').toDate().toISOString())
      .toBe('2026-08-18T20:00:00.000Z')
  })

  it('falls back instead of throwing for an unusable zone', () => {
    expect(() => (dayjs as any).tz('2026-08-19 20:15', 'YYYY-MM-DD HH:mm', 'Not/A_Real_Zone')).toThrow()
  })

  it('keeps dayjs.tz helpers reachable', () => {
    expect(typeof (dayjs as any).tz.guess).toBe('function')
  })
})
