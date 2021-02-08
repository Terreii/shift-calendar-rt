/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from '../../styles/calender.module.css'

/**
 * Render the day in month cell.
 * @param {object}   param                       Preact arguments.
 * @param {import('luxon').DateTime} param.time  luxon DateTime object.
 * @param {object}   [param.holidayData]         Holiday data of that day.
 * @param {object}   [param.dayLightSaving]      Data about the daylight saving switch.
 */
export default function DayInMonthCell ({ time, holidayData, dayLightSaving }) {
  // is on this day the switch from or to day-light-saving.
  const isDayLightSaving = dayLightSaving != null && dayLightSaving.day === time.day

  let title
  if (isDayLightSaving) {
    title = dayLightSaving.name
  } else if (holidayData != null) {
    title = holidayData.name
  }

  return (
    <td
      className={style.day_in_month}
      title={title}
      data-holiday={holidayData?.type}
      data-daylight={isDayLightSaving ? true : null}
    >
      <time dateTime={time.toISODate()}>
        {time.day}
      </time>
    </td>
  )
}
