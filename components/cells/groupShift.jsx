/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { shiftTitle, workingLongName } from '../../lib/constants'

/**
 * Render a cell that displays if that shift group is working and what shift.
 * @param {object}          param                 Preact arguments.
 * @param {number}          param.group           Number of group. Group 1 is 0.
 * @param {"F"|"S"|"N"|"K"} param.shift           Shift data.
 * @param {boolean}         param.isToday         Is that cell of today?
 * @param {boolean}         param.isSearchResult  Is that day searched for?
 */
export default function GroupShiftCell ({ group, shift, isToday, isSearchResult }) {
  let border = ''
  if (isSearchResult) {
    border = 'border-t-4 border-b-4 border-violet-400'
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
      className={`text-black ${border} ${workStyle}`}
      title={title}
    >
      {shift !== 'K' && (
        <>
          <span className='sr-only'>{workingLongName[shift]}</span>
          <span aria-hidden='true'>{shift}</span>
        </>
      )}
    </td>
  )
}
