/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import { dayName, shiftTitle } from '../../lib/constants'

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
export default ({ year, month, data, today, search, group }) => {
  const todayInThisMonth = today != null && today[0] === year && today[1] === month

  // Render every row/day.
  const dayRows = data.days.map((dayData, index) => {
    const thatDay = index + 1
    const aDay = new Date(year, month, thatDay).getDay()
    const holidayData = data.holidays[thatDay]

    const day = group === 0
      ? dayData // if 0 display all groups
      : [ // else return array of one group number
        dayData[Math.min(group - 1, dayData.length - 1)] // just a guard
      ]

    // is on this day the switch from or to day-light-saving.
    const isDayLightSaving = data.holidays.daylightSavingSwitch != null &&
      data.holidays.daylightSavingSwitch.day === thatDay

    return <tr
      key={index}
      class={style.DayRow}
      data-day={aDay}
      data-today={todayInThisMonth && (
        thatDay === today[2] || (today[3] < 6 && (thatDay + 1 === today[2]))
      )}
      data-holiday={holidayData != null ? holidayData.type : null}
      data-search={search === thatDay}
      title={holidayData != null ? holidayData.name : null}
    >
      <td
        data-dayLightSaving={isDayLightSaving}
        title={isDayLightSaving ? data.holidays.daylightSavingSwitch.name : null}
      >
        {thatDay}
      </td>
      <td>{dayName[aDay]}</td>

      {day.map((shift, index, all) => {
        const gr = all.length > 1 ? index : group - 1

        return <td
          key={gr}
          title={shiftTitle[shift]}
          data-group={gr}
          data-working={shift !== 'K'}
        >
          {shift === 'K' ? '' : shift}
        </td>
      })}
    </tr>
  })

  return <tbody>{dayRows}</tbody>
}
