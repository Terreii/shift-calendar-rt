/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { DateTime, Info } from 'luxon'
import { useDispatch } from 'react-redux'

import WeekCell from './cells/week'
import DayInMonthCell from './cells/dayInMonth'
import WeekDayCell from './cells/weekDay'
import GroupShiftCell from './cells/groupShift'
import VacationCell from './cells/vacation'
import { addDay, removeDay } from '../lib/reducers/vacation'

import style from '../styles/calender.module.css'

/**
 * @typedef {Object} MonthData
 * @property {("F"|"S"|"N"|"K")[][]} days      List of working days of every group
 * @property {object}                holidays  Object containing all holidays of that month.
 */

const supportZones = Info.features().zones

/**
 * Renders the body of a month.
 * @param {Object}     arg          React/Preact arguments.
 * @param {number}     arg.year     Year of the month.
 * @param {number}     arg.month    Month of this month.
 * @param {MonthData}  arg.data     Data of this month.
 * @param {number[]}   [arg.today]  Array of numbers that contains todays date. [year, month, day].
 * @param {number}     [arg.search] Date of the search result. Or null.
 * @param {number}     arg.group    Group to display. 0 = All, 1 - 6 is group number
 * @param {boolean}    arg.hasVacations Does that month have vacation days.
 * @param {[boolean, {[key: string]: {
 *   id: string,
 *   name: string
 * }}]}                arg.vacation Vacation days in this month.
 * @param {number[]}   arg.selectedVacationsDays  Selected vacation days. For editing.
 * @param {boolean}    arg.isEditingVacations   Is the user editing their vacations.
 * @returns {JSX.Element}
 */
export default function MonthBody ({
  year,
  month,
  data,
  today,
  search,
  group,
  hasVacations,
  vacation,
  selectedVacationsDays,
  isEditingVacations
}) {
  const dispatch = useDispatch()
  const todayInThisMonth = today != null && today[0] === year && today[1] === month

  // Render every row/day.
  const dayRows = data.days.map((dayShiftsData, index) => {
    const thatDay = index + 1
    const time = DateTime.fromObject({
      year,
      month: month + 1,
      day: thatDay,
      locale: 'de-DE',
      zone: supportZones ? 'Europe/Berlin' : undefined
    })
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

    const isClosingHoliday = holidayData != null && holidayData.type === 'closing'

    let interesting
    if (isSearchResult) {
      interesting = 'search'
    } else if (isToday) {
      interesting = 'today'
    }

    return (
      <tr
        key={index}
        id={time.toISODate()}
        className={style.row}
        data-interest={interesting}
        data-weekend={[0, 6, 7].includes(weekDay)}
        data-closing={isClosingHoliday ? 'closing' : undefined}
        title={isClosingHoliday ? holidayData.name : undefined}
      >
        {(weekDay === 1 || index === 0) && (
          <WeekCell time={time} />
        )}
        <DayInMonthCell
          time={time}
          holidayData={holidayData}
          dayLightSaving={data.holidays.daylightSavingSwitch}
        />
        <WeekDayCell time={time} />

        {shifts.map((shift, index, all) => {
          const gr = group === 0 ? index : group - 1
          return (
            <GroupShiftCell
              key={gr}
              group={gr}
              shift={shift}
              isToday={isToday}
            />
          )
        })}
        {(isEditingVacations || hasVacations) && (
          <VacationCell
            vacation={vacation[time.day]}
            isEditing={isEditingVacations}
            isSelected={selectedVacationsDays[time.day]}
            onChange={checked => {
              if (checked) {
                dispatch(addDay(time.year, time.month, time.day))
              } else {
                dispatch(removeDay(time.year, time.month, time.day))
              }
            }}
          />
        )}
      </tr>
    )
  })

  return <tbody>{dayRows}</tbody>
}
