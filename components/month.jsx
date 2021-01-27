/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { memo } from 'react'

import MonthBody from './month-body'
import { monthNames } from '../lib/constants'

/**
 * Render a month
 * @param {Object}   arg0          React/Preact arguments.
 * @param {number}   arg0.year     Year of the month.
 * @param {number}   arg0.month    Month number in the year of this month.
 * @param {Object}   arg0.data     Month-data that contains all workdays and holidays of that month.
 * @param {number[]} arg0.today    Array of numbers that contains todays date. [year, month, day].
 * @param {?number}  arg0.search   Date of the search result. Or null.
 * @param {number}   arg0.group    Group to display. 0 = All, 1 - 6 is group number
 * @returns {JSX.Element}
 */
function Month ({ className = '', year, month, data, today, search, group }) {
  const groups = []

  if (group === 0) { // if 0 display all groups
    for (let i = 0, max = data.workingCount.length; i < max; ++i) {
      groups.push(i)
    }
  } else { // else return array of one group number
    groups.push(group - 1)
  }

  const isToday = today != null && today[0] === year && today[1] === month

  return (
    <table
      id={`month_${year}-${month + 1}`}
      className={'mt-8 text-center border border-collapse border-black xl:mt-0 ' + className}
      aria-labelledby={`month_${year}-${month + 1}_caption`}
    >
      <caption
        id={`month_${year}-${month + 1}_caption`}
        className={isToday
          ? 'border border-b-0 border-black bg-gray-300 text-black font-bold'
          : 'font-bold'}
      >
        {monthNames[month]} {year}{isToday ? ' (Jetzt)' : ''}
      </caption>
      <thead>
        <tr>
          <th>
            <span className='sr-only'>Woche</span>
            <span aria-hidden='true' title='Woche'>Wo</span>
          </th>
          <th title='Tag im Monat' aria-label='Tag im Monat'>Tag</th>
          <th title='Wochentag'>
            <span className='sr-only'>Wochentag</span>
          </th>
          {groups.map(gr => (
            <th key={gr}>
              <span className='sr-only'>{'Gruppe ' + (gr + 1)}</span>
              <span aria-hidden='true' title={'Gruppe ' + (gr + 1)}>
                Gr. {gr + 1}
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <MonthBody
        year={year}
        month={month}
        data={data}
        today={today}
        search={search}
        group={group}
      />

      <tfoot className='text-sm font-bold'>
        <tr>
          <td
            className='p-1 border border-black cursor-help'
            colSpan='3'
            title='Summe der Tage an denen eine Schichtgruppe diesen Monat arbeitet.'
          >
            Summe
          </td>
          {groups.map(gr => (
            <td key={gr} aria-label='Summe Arbeitstage'>
              {data.workingCount[gr]}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  )
}

export default memo(Month)
