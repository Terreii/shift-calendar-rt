/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'

/**
 * Render the day in month cell.
 * @param {object}   param                  Preact arguments.
 * @param {DateTime} param.time             luxon DateTime object.
 * @param {object}   [param.holidayData]    Holiday data of that day.
 * @param {object}   [param.dayLightSaving] Data about the daylight saving switch.
 * @param {boolean}  param.isToday          Is that day today.
 * @param {boolean}  param.isSearchResult   Is that day searched for?
 */
export default function DayInMonthCell ({
  time,
  holidayData,
  dayLightSaving,
  isToday,
  isSearchResult,
  isWeekCellStart
}) {
  // is on this day the switch from or to day-light-saving.
  const isDayLightSaving = dayLightSaving != null && dayLightSaving.day === time.day

  const border = isToday || isSearchResult
    ? `${isWeekCellStart ? '' : 'border-l-4'} border-t-4 border-b-4`
    : 'border-l'
  const borderColor = isSearchResult ? 'border-violet-400' : 'border-black'

  let holidayStyle = ''
  if (isDayLightSaving) {
    holidayStyle = 'bg-yellow-300 text-black cursor-help border-4 border-red-600'
  } else if (holidayData != null && ['holiday', 'school'].includes(holidayData.type)) {
    holidayStyle = 'bg-teal-400 text-black'
  }

  return (
    <td
      class={`${borderColor} ${border} ${holidayStyle}`}
      title={isDayLightSaving
        ? dayLightSaving.name
        : (holidayData != null ? holidayData.name : null)}
    >
      <time dateTime={time.toISODate()}>
        {time.day}
      </time>
    </td>
  )
}
