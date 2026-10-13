export const MomentOptionUtils = () => {
  /**
   * Function to get formatted time list
   * @param {*} selectedDate = selected Date
   * @param {*} schedule = schedule list
   * @param {*} is12Hours = variable for time format
   */
  const getTimes = (selectedDate: any, schedule: any, is12Hours: any) => {
    const date = new Date()
    const times = []
    for (let k = 0; k < schedule[selectedDate.getDay()].lapses.length; k++) {
      const open = {
        hour: schedule[selectedDate.getDay()].lapses[k].open.hour,
        minute: schedule[selectedDate.getDay()].lapses[k].open.minute
      }
      const close = {
        hour: schedule[selectedDate.getDay()].lapses[k].close.hour,
        minute: schedule[selectedDate.getDay()].lapses[k].close.minute
      }
      for (let i = open.hour; i <= close.hour; i++) {
        if (date.getDate() !== selectedDate.getDate() || i >= date.getHours()) {
          let hour = ''
          let meridian = ''
          if (is12Hours) {
            if (i === 0) {
              hour = '12'
              meridian = ' ' + 'AM'
            } else if (i > 0 && i < 12) {
              hour = (i < 10 ? '0' + i : i).toString()
              meridian = ' ' + 'AM'
            } else if (i === 12) {
              hour = '12'
              meridian = ' ' + 'PM'
            } else {
              hour = ((i - 12 < 10) ? '0' + (i - 12) : `${(i - 12)}`)
              meridian = ' ' + 'PM'
            }
          } else {
            hour = (i < 10 ? '0' + i : i).toString()
          }
          for (let j = (i === open.hour ? open.minute : 0); j <= (i === close.hour ? close.minute : 59); j += 15) {
            if (i !== date.getHours() || j >= date.getMinutes() || date.getDate() !== selectedDate.getDate()) {
              times.push({
                text: hour + ':' + (j < 10 ? '0' + j : j) + meridian,
                value: (i < 10 ? '0' + i : i) + ':' + (j < 10 ? '0' + j : j)
              })
            }
          }
        }
      }
    }
    return times
  }

  /**
   * Function to get formatted time list with timezone conversion
   * @param {*} selectedDate = selected Date
   * @param {*} schedule = schedule list (in business timezone)
   * @param {*} is12Hours = variable for time format
   * @param {*} businessTimezone = business timezone
   * @param {*} userTimezone = user timezone (optional, defaults to local timezone)
   */
  const getTimesWithTimezone = (selectedDate: any, schedule: any, is12Hours: any, businessTimezone: any, userTimezone: any) => {
    const times = []

    // Get user timezone if not provided
    if (!userTimezone) {
      try {
        userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      } catch (error) {
        userTimezone = 'UTC'
      }
    }

    const moment = require('moment-timezone')

    // Get current time in business timezone for validation
    const currentTimeInBusinessTz = moment().tz(businessTimezone)
    const selectedDateInBusinessTz = moment(selectedDate).tz(businessTimezone).startOf('day')

    for (let k = 0; k < schedule[selectedDate.getDay()].lapses.length; k++) {
      const open = {
        hour: schedule[selectedDate.getDay()].lapses[k].open.hour,
        minute: schedule[selectedDate.getDay()].lapses[k].open.minute
      }
      const close = {
        hour: schedule[selectedDate.getDay()].lapses[k].close.hour,
        minute: schedule[selectedDate.getDay()].lapses[k].close.minute
      }

      // Generate times in user timezone from 0:00 to 23:45
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          // Create the time in user timezone
          const dateStr = moment(selectedDate).format('YYYY-MM-DD')
          const timeInUserTz = moment.tz(`${dateStr} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`, userTimezone)

          // Convert to business timezone for validation
          const timeInBusinessTz = timeInUserTz.clone().tz(businessTimezone)

          // Check if this time is within business hours
          const businessHour = timeInBusinessTz.hours()
          const businessMinute = timeInBusinessTz.minutes()

          const isWithinBusinessHours =
            (businessHour > open.hour || (businessHour === open.hour && businessMinute >= open.minute)) &&
            (businessHour < close.hour || (businessHour === close.hour && businessMinute <= close.minute))

          // Check if this time is in the future for the business
          const isInFuture = timeInBusinessTz.isAfter(currentTimeInBusinessTz)

          // Check if this time is on the same day as the selected date in business timezone
          const isSameDay = timeInBusinessTz.date() === selectedDateInBusinessTz.date()

          if (isWithinBusinessHours && isInFuture && isSameDay) {
            let displayHour = ''
            let meridian = ''
            if (is12Hours) {
              if (hour === 0) {
                displayHour = '12'
                meridian = ' ' + 'AM'
              } else if (hour > 0 && hour < 12) {
                displayHour = (hour < 10 ? '0' + hour : hour).toString()
                meridian = ' ' + 'AM'
              } else if (hour === 12) {
                displayHour = '12'
                meridian = ' ' + 'PM'
              } else {
                displayHour = ((hour - 12 < 10) ? '0' + (hour - 12) : `${(hour - 12)}`)
                meridian = ' ' + 'PM'
              }
            } else {
              displayHour = (hour < 10 ? '0' + hour : hour).toString()
            }

            times.push({
              text: displayHour + ':' + (minute < 10 ? '0' + minute : minute) + meridian,
              value: (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
            })
          }
        }
      }
    }

    return times
  }

  return { getTimesWithTimezone, getTimes };
};
