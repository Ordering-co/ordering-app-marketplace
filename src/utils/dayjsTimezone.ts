import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Offset in minutes between UTC and `timeZone` at the given instant, derived
 * from `Intl.DateTimeFormat.formatToParts`.
 *
 * @returns {number|null} null when the runtime cannot resolve the zone.
 */
export const zoneOffsetMinutes = (date: Date, timeZone: string): number | null => {
  try {
    const wall: Record<string, string> = {}
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).formatToParts(date).forEach(({ type, value }) => { wall[type] = value })
    if (!wall.year || !wall.month || !wall.hour) return null
    const asUtc = Date.UTC(
      Number(wall.year),
      Number(wall.month) - 1,
      Number(wall.day),
      Number(wall.hour) % 24,
      Number(wall.minute),
      Number(wall.second)
    )
    const instant = date.getTime() - date.getMilliseconds()
    if (!Number.isFinite(asUtc) || !Number.isFinite(instant)) return null
    return Math.round((asUtc - instant) / 60000)
  } catch (error) {
    return null
  }
}

/**
 * dayjs' `timezone` plugin resolves the instance `.tz()` offset by re-parsing
 * `toLocaleString('en-US')`. Hermes does not parse that format, so the offset
 * comes out NaN and the plugin falls back to `utcOffset(0)` — every business
 * time silently becomes UTC, without throwing.
 *
 * Its static `dayjs.tz(string, format, zone)` uses `formatToParts` instead and
 * is unaffected, so only the instance method is replaced here. The submodule
 * resolves `dayjs` from this app's node_modules, so patching the shared
 * prototype fixes its internals too without forking shared code.
 *
 * Falls back to the original implementation whenever the offset cannot be
 * resolved, and for `keepLocalTime`, whose semantics are left untouched.
 */
const patchInstanceTz = () => {
  const proto: any = Object.getPrototypeOf(dayjs())
  if (!proto || typeof proto.tz !== 'function' || proto.__tzPatched) return
  const originalTz = proto.tz
  proto.tz = function (timeZone?: string, keepLocalTime?: boolean) {
    if (!timeZone || keepLocalTime) return originalTz.call(this, timeZone, keepLocalTime)
    const offset = zoneOffsetMinutes(this.toDate(), timeZone)
    return offset === null ? originalTz.call(this, timeZone, keepLocalTime) : this.utcOffset(offset)
  }
  proto.__tzPatched = true
}

patchInstanceTz()

const WALL_CLOCK = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/

/** Instant for a wall clock in `timeZone`, using that date's offset. */
const wallClockToInstant = (parts: RegExpMatchArray, timeZone: string) => {
  const naive = Date.UTC(
    Number(parts[1]),
    Number(parts[2]) - 1,
    Number(parts[3]),
    Number(parts[4] ?? 0),
    Number(parts[5] ?? 0),
    Number(parts[6] ?? 0)
  )
  if (!Number.isFinite(naive)) return null
  let offset = zoneOffsetMinutes(new Date(naive), timeZone)
  if (offset === null) return null
  const corrected = zoneOffsetMinutes(new Date(naive - offset * 60000), timeZone)
  if (corrected !== null) offset = corrected
  return { instant: naive - offset * 60000, offset }
}

/**
 * `dayjs.tz(string, ...)` parses through the engine's `Date`, which on Hermes
 * cannot read `YYYY-MM-DD HH:mm` and silently yields the current time instead.
 */
const patchStaticTz = () => {
  const target: any = dayjs
  if (typeof target.tz !== 'function' || target.tz.__tzPatched) return
  const originalTz = target.tz
  const patched: any = function (this: any, input?: any, arg1?: any, arg2?: any) {
    const timeZone = arg2 || arg1
    if (typeof input !== 'string' || typeof timeZone !== 'string') {
      return originalTz.call(this, input, arg1, arg2)
    }
    const parts = input.match(WALL_CLOCK)
    const resolved = parts && wallClockToInstant(parts, timeZone)
    return resolved
      ? dayjs(resolved.instant).utcOffset(resolved.offset)
      : originalTz.call(this, input, arg1, arg2)
  }
  Object.keys(originalTz).forEach(key => { patched[key] = originalTz[key] })
  patched.__tzPatched = true
  target.tz = patched
}

patchStaticTz()

/**
 * Last selectable instant of the day `daysAhead` from now, in `timeZone`.
 * The offset is resolved for the target day rather than carried over from
 * today, which would be an hour out across a daylight saving change.
 */
export const businessEndOfDay = (timeZone: string, daysAhead: number): Date => {
  const targetDay = dayjs().tz(timeZone).add(daysAhead, 'day').format('YYYY-MM-DD')
  const endOfDay = dayjs.tz(`${targetDay} 23:59:59`, 'YYYY-MM-DD HH:mm:ss', timeZone)
  return endOfDay.isValid() ? endOfDay.toDate() : dayjs().add(daysAhead, 'day').endOf('day').toDate()
}
