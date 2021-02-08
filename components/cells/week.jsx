/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from '../../styles/calender.module.css'

/**
 * Render the weekday.
 * @param {object}                   param       Preact arguments.
 * @param {import('luxon').DateTime} param.time  luxon DateTime object.
 */
export default function WeekCell ({ time }) {
  return (
    <td
      className={style.week_cell}
      rowSpan={Math.min(7 - time.weekday, time.daysInMonth - time.day) + 1}
    >
      <span className='sr-only'>Woche {time.weekNumber}</span>
      <span aria-hidden='true'>{time.weekNumber}</span>
    </td>
  )
}
