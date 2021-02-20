/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { memo } from 'react'
import { useSelector } from 'react-redux'

import MonthBody from './month-body'
import { monthNames } from '../lib/constants'
import { selectIsEditing, selectDaysByMonth } from '../lib/reducers/vacation'

import style from '../styles/calender.module.css'

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
  const isEditingVacations = useSelector(selectIsEditing)
  const selectedVacationsDays = useSelector(selectDaysByMonth)[`${year}-${month + 1}`] ?? {}
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
      className={style.table + ' ' + className}
      aria-labelledby={`month_${year}-${month + 1}_caption`}
    >
      <caption
        id={`month_${year}-${month + 1}_caption`}
        data-is-today={isToday}
        className={style.title}
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
          {isEditingVacations && (
            <td>
              <span className='sr-only'>Urlaub</span>
              <span aria-hidden='true' title='Urlaub'>🏖</span>
            </td>
          )}
        </tr>
      </thead>

      <MonthBody
        year={year}
        month={month}
        data={data}
        today={today}
        search={search}
        group={group}
        selectedVacationsDays={selectedVacationsDays}
        isEditingVacations={isEditingVacations}
      />

      <tfoot className={style.footer}>
        <tr>
          <td
            className={style.sum}
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
          {isEditingVacations && (
            <td />
          )}
        </tr>
      </tfoot>
    </table>
  )
}

export default memo(Month)
