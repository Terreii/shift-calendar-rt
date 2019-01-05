/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const shiftTitle = {
  'F': 'Frühschicht\r\n6 - 14:30 Uhr',
  'S': 'Spätschicht\r\n14 - 22:30 Uhr',
  'N': 'Nachtschicht\r\n22 - 6:30 Uhr (in den nächsten Tag)',
  'K': null
}

/**
 * Renders the body of a month.
 * @param {Object}    arg0         React/Preact arguments.
 * @param {number}    arg0.year    Year of the month.
 * @param {number}    arg0.month   Month of this month.
 * @param {Object}    arg0.data    Data of this month.
 * @param {?number[]} arg0.today   Array of numbers that contains todays date. [year, month, day].
 */
export default ({ year, month, data, today }) => {
  const todayInThisMonth = today != null && today[0] === year && today[1] === month

  // Render every row/day.
  const dayRows = data.days.map((day, index) => {
    const thatDay = index + 1
    const aDay = new Date(year, month, thatDay).getDay()
    const holidayData = data.holidays[thatDay]

    // is on this day the switch from or to day-light-saving.
    const isDayLightSaving = data.holidays.daylightSavingSwitch != null &&
      data.holidays.daylightSavingSwitch.day === thatDay

    return <tr
      key={index}
      class={style.DayRow}
      data-day={aDay}
      data-today={todayInThisMonth && thatDay === today[2]}
      data-holiday={holidayData != null ? holidayData.type : null}
      title={holidayData != null ? holidayData.name : null}
    >
      <td
        data-dayLightSaving={isDayLightSaving}
        title={isDayLightSaving ? data.holidays.daylightSavingSwitch.name : null}
      >
        {thatDay}
      </td>
      <td>{dayName[aDay]}</td>
      {day.map((shift, gr) => (
        <td
          key={gr}
          title={shiftTitle[shift]}
          data-working={shift !== 'K'}
        >
          {shift === 'K' ? '' : shift}
        </td>
      ))}
    </tr>
  })

  return <tbody>
    {dayRows}
    <tr class={style.WorkinDaysRow}>
      <td
        class={style.WorkingDaysInfo}
        colSpan='2'
        title='Die Anzahl der Tage, an denen eine Schichtgruppe diesen Monat arbeitet.'
      >
        Anzahl
      </td>
      {data.workingCount.map((number, index) => <td key={index}>{number}</td>)}
    </tr>
  </tbody>
}
