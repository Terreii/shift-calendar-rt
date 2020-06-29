/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Fragment } from 'preact'
import { DateTime } from 'luxon'

import { shiftTitle, workingLongName } from '../lib/constants.js'

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
      background = 'bg-gray-400'
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

/**
 * Render the weekday.
 * @param {object}   param       Preact arguments.
 * @param {DateTime} param.time  luxon DateTime object.
 */
function WeekCell ({ time }) {
  return (
    <td
      class='text-gray-800 bg-white border-r border-black'
      rowSpan={Math.min(7 - time.weekday, time.daysInMonth - time.day) + 1}
    >
      <span class='sr-only'>Woche {time.weekNumber}</span>
      <span aria-hidden='true'>{time.weekNumber}</span>
    </td>
  )
}

/**
 * Render the day in month cell.
 * @param {object}   param                  Preact arguments.
 * @param {DateTime} param.time             luxon DateTime object.
 * @param {object}   [param.holidayData]    Holiday data of that day.
 * @param {object}   [param.dayLightSaving] Data about the daylight saving switch.
 * @param {boolean}  param.isToday          Is that day today.
 * @param {boolean}  param.isSearchResult   Is that day searched for?
 */
function DayInMonthCell ({ time, holidayData, dayLightSaving, isToday, isSearchResult }) {
  // is on this day the switch from or to day-light-saving.
  const isDayLightSaving = dayLightSaving != null && dayLightSaving.day === time.day

  const border = isToday || isSearchResult ? 'border-l-4 border-t-4 border-b-4' : 'border-l'
  const borderColor = isSearchResult ? 'border-teal-400' : 'border-black'

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

/**
 * Render the cell with the week day.
 * @param {object}   param                 Preact arguments.
 * @param {DateTime} param.time            luxon DateTime object.
 * @param {boolean}  param.isToday         Is that cell of today?
 * @param {boolean}  param.isSearchResult  Is that cell part of a day that was searched for?
 */
function WeekDayCell ({ time, isToday, isSearchResult }) {
  let border = ''
  if (isSearchResult) {
    border = 'border-t-4 border-b-4 border-teal-400'
  } else if (isToday) {
    border = 'border-t-4 border-b-4 border-black'
  }

  return (
    <td class={border}>
      <span class='sr-only'>{time.weekdayLong}</span>
      <span aria-hidden='true'>{time.weekdayShort}</span>
    </td>
  )
}

/**
 * Render a cell that displays if that shift group is working and what shift.
 * @param {object}          param                 Preact arguments.
 * @param {number}          param.group           Number of group. Group 1 is 0.
 * @param {"F"|"S"|"N"|"K"} param.shift           Shift data.
 * @param {boolean}         param.isToday         Is that cell of today?
 * @param {boolean}         param.isSearchResult  Is that day searched for?
 */
function GroupShiftCell ({ group, shift, isToday, isSearchResult }) {
  let border = ''
  if (isSearchResult) {
    border = 'border-t-4 border-b-4 border-teal-400'
  } else if (isToday) {
    border = 'border-t-4 border-b-4 border-black'
  }

  const groupColors = [
    'bg-group-1',
    'bg-group-2',
    'bg-group-3',
    'bg-group-4',
    'bg-group-5',
    'bg-group-6'
  ]
  const workStyle = shift !== 'K' ? groupColors[group] : ''
  const title = isToday ? 'Heute ' + shiftTitle[shift] : shiftTitle[shift]

  return (
    <td
      class={`text-black ${border} ${workStyle}`}
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
}
