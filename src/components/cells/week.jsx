/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'

/**
 * Render the weekday.
 * @param {object}   param       Preact arguments.
 * @param {DateTime} param.time  luxon DateTime object.
 */
export default function WeekCell ({ time }) {
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
