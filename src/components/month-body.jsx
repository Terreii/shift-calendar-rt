/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Fragment } from 'preact'
import { DateTime } from 'luxon'

import { shiftTitle, workingLongName } from '../lib/constants.js'

/**
 * Renders the body of a month.
 * @param {Object}    arg0          React/Preact arguments.
 * @param {number}    arg0.year     Year of the month.
 * @param {number}    arg0.month    Month of this month.
 * @param {Object}    arg0.data     Data of this month.
 * @param {number[]}  [arg0.today]  Array of numbers that contains todays date. [year, month, day].
 * @param {number}    [arg0.search] Date of the search result. Or null.
 * @param {number}    arg0.group    Group to display. 0 = All, 1 - 6 is group number
 * @returns {JSX.Element}
 */
export default function MonthBody ({ year, month, data, today, search, group }) {
  const todayInThisMonth = today != null && today[0] === year && today[1] === month

  // Render every row/day.
  const dayRows = data.days.map((dayData, index) => {
    const thatDay = index + 1
    const time = DateTime.fromObject({ year, month: month + 1, day: thatDay, locale: 'de-DE' })
    const weekDay = time.weekday
    const holidayData = data.holidays[thatDay]

    const day = group === 0
      ? dayData // if 0 display all groups
      : [ // else return array of one group number
        dayData[Math.min(group - 1, dayData.length - 1)] // just a guard
      ]

    // is on this day the switch from or to day-light-saving.
    const isDayLightSaving = data.holidays.daylightSavingSwitch != null &&
      data.holidays.daylightSavingSwitch.day === thatDay

    const isToday = todayInThisMonth && (
      thatDay === today[2] || (today[3] < 6 && (thatDay + 1 === today[2]))
    )
    const isSearchResult = search === thatDay
    const isBorderBold = isToday || isSearchResult
    const borderColor = isSearchResult ? 'border-teal-400' : 'border-black'

    const isWeekend = [0, 6, 7].includes(weekDay)
    const isClosingHoliday = holidayData != null && holidayData.type === 'closing'
    const rowBgColor = isClosingHoliday
      ? 'bg-green-700'
      : (isWeekend ? 'bg-gray-400' : '')
    const color = isClosingHoliday ? 'text-white' : ''

    return (
      <tr
        key={index}
        class={`${borderColor} ${isBorderBold ? 'border-r-4' : ''} ${rowBgColor} ${color}`}
        title={holidayData != null && holidayData.type === 'closing' ? holidayData.name : undefined}
      >
        {(weekDay === 1 || index === 0) && (
          <td
            class='text-gray-800 bg-white border-r border-black'
            rowSpan={Math.min(8 - weekDay, time.daysInMonth - index)}
          >
            <span class='sr-only'>{'Woche ' + time.weekNumber}</span>
            <span aria-hidden='true'>{time.weekNumber}</span>
          </td>
        )}
        <td
          class={
            `${borderColor} ${isBorderBold ? 'border-l-4 border-t-4 border-b-4' : 'border-l'}` +
            (isDayLightSaving ? ' bg-yellow-300 text-black cursor-help border-4 border-red-600' : (
              holidayData != null && ['holiday', 'school'].includes(holidayData.type)
                ? ' bg-teal-400 text-black'
                : ''
            ))
          }
          title={isDayLightSaving
            ? data.holidays.daylightSavingSwitch.name
            : (holidayData != null ? holidayData.name : null)}
        >
          <time dateTime={time.toISODate()}>
            {thatDay}
          </time>
        </td>
        <td
          class={isBorderBold ? 'border-t-4 border-b-4 ' + borderColor : ''}
        >
          <span class='sr-only'>{time.weekdayLong}</span>
          <span aria-hidden='true'>{time.weekdayShort}</span>
        </td>

        {day.map((shift, index, all) => {
          const gr = all.length > 1 ? index : group - 1
          const border = isBorderBold ? 'border-t-4 border-b-4 ' + borderColor : ''
          const groupColors = [
            'bg-group-1',
            'bg-group-2',
            'bg-group-3',
            'bg-group-4',
            'bg-group-5',
            'bg-group-6'
          ]
          const workStyle = shift !== 'K' ? 'text-black ' + groupColors[gr] : ''
          const title = isToday ? 'Heute ' + shiftTitle[shift] : shiftTitle[shift]

          return (
            <td
              key={gr}
              class={`${border} ${workStyle}`}
              title={title}
            >
              {shift !== 'K' && (
                <>
                  <span class='sr-only'>{workingLongName[shift]}</span>
                  <span aria-hidden='true'>{shift}</span>
                </>
              )}
            </td>
          )
        })}
      </tr>
    )
  })

  return <tbody>{dayRows}</tbody>
}
