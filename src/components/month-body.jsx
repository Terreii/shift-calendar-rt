/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { DateTime } from 'luxon'

import WeekCell from './cells/week'
import DayInMonthCell from './cells/dayInMonth'
import WeekDayCell from './cells/weekDay'
import GroupShiftCell from './cells/groupShift'

/**
 * @typedef {Object} MonthData
 * @property {("F"|"S"|"N"|"K")[][]} days      List of working days of every group
 * @property {object}                holidays  Object containing all holidays of that month.
 */

/**
 * Renders the body of a month.
 * @param {Object}     arg          React/Preact arguments.
 * @param {number}     arg.year     Year of the month.
 * @param {number}     arg.month    Month of this month.
 * @param {MonthData}  arg.data     Data of this month.
 * @param {number[]}   [arg.today]  Array of numbers that contains todays date. [year, month, day].
 * @param {number}     [arg.search] Date of the search result. Or null.
 * @param {number}     arg.group    Group to display. 0 = All, 1 - 6 is group number
 * @returns {JSX.Element}
 */
export default function MonthBody ({ year, month, data, today, search, group }) {
  const todayInThisMonth = today != null && today[0] === year && today[1] === month

  // Render every row/day.
  const dayRows = data.days.map((dayShiftsData, index) => {
    const thatDay = index + 1
    const time = DateTime.fromObject({ year, month: month + 1, day: thatDay, locale: 'de-DE' })
    const weekDay = time.weekday
    const holidayData = data.holidays[thatDay]

    const shifts = group === 0
      ? dayShiftsData // if 0; display all groups
      : dayShiftsData.slice(group - 1, group) // else return array of one group number

    // isToday is true when the date is: actual today and up to 6:00am the day before.
    // Because the shifts work until 6am.
    const isToday = todayInThisMonth && (
      thatDay === today[2] || (today[3] < 6 && (thatDay + 1 === today[2]))
    )
    const isSearchResult = search === thatDay

    let border = ''
    if (isSearchResult) {
      border = 'border-r-4 border-teal-400'
    } else if (isToday) {
      border = 'border-r-4 border-black'
    }

    const isWeekend = [0, 6, 7].includes(weekDay)
    const isClosingHoliday = holidayData != null && holidayData.type === 'closing'

    let background = ''
    if (isClosingHoliday) {
      background = 'bg-green-700 text-white'
    } else if (isWeekend) {
      background = 'bg-gray-300'
    }

    return (
      <tr
        key={index}
        class={`${border} ${background}`}
        title={holidayData != null && holidayData.type === 'closing' ? holidayData.name : undefined}
      >
        {(weekDay === 1 || index === 0) && (
          <WeekCell time={time} />
        )}
        <DayInMonthCell
          time={time}
          holidayData={holidayData}
          dayLightSaving={data.holidays.daylightSavingSwitch}
          isToday={isToday}
          isSearchResult={isSearchResult}
        />
        <WeekDayCell
          time={time}
          isToday={isToday}
          isSearchResult={isSearchResult}
        />

        {shifts.map((shift, index, all) => {
          const gr = group === 0 ? index : group - 1
          return (
            <GroupShiftCell
              key={gr}
              group={gr}
              shift={shift}
              isToday={isToday}
              isSearchResult={isSearchResult}
            />
          )
        })}
      </tr>
    )
  })

  return <tbody>{dayRows}</tbody>
}
