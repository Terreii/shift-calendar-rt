/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from '../../styles/calender.module.css'

/**
 * Render the cell with the week day.
 * @param {object}                   param                 Preact arguments.
 * @param {import('luxon').DateTime} param.time            luxon DateTime object.
 */
export default function WeekDayCell ({ time }) {
  return (
    <td className={style.week_day}>
      <span className='sr-only'>{time.weekdayLong}</span>
      <span aria-hidden='true'>{time.weekdayShort}</span>
    </td>
  )
}
