/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { shiftTitle, workingLongName } from '../../lib/constants'

import style from '../../styles/calender.module.css'

/**
 * Render a cell that displays if that shift group is working and what shift.
 * @param {object}          param                 Preact arguments.
 * @param {number}          param.group           Number of group. Group 1 is 0.
 * @param {"F"|"S"|"N"|"K"} param.shift           Shift data.
 * @param {boolean}         param.isToday         Is that cell of today?
 */
export default function GroupShiftCell ({ group, shift, isToday }) {
  const title = isToday ? 'Heute ' + (shiftTitle[shift] ?? '') : shiftTitle[shift]

  if (shift === 'K') {
    return (
      <td
        className={style.group}
        title={title}
      />
    )
  }

  return (
    <td
      className={style.group}
      title={title}
      data-group={group + 1}
    >
      {shift}
    </td>
  )
}
