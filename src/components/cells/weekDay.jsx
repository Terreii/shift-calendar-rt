/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'

/**
 * Render the cell with the week day.
 * @param {object}   param                 Preact arguments.
 * @param {DateTime} param.time            luxon DateTime object.
 * @param {boolean}  param.isToday         Is that cell of today?
 * @param {boolean}  param.isSearchResult  Is that cell part of a day that was searched for?
 */
export default function WeekDayCell ({ time, isToday, isSearchResult }) {
  let border = ''
  if (isSearchResult) {
    border = 'border-t-4 border-b-4 border-violet-400'
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
