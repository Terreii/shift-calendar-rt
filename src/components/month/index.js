/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import style from './style.less'

import MonthBody from '../month-body'
import { monthNames } from '../../lib/constants'

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
export default class Month extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return [
      'year',
      'month',
      'data',
      'today',
      'search',
      'group'
    ].some(key => this.props[key] !== nextProps[key])
  }

  render () {
    const { year, month, data, today, search, group } = this.props
    const grRow = []

    if (group === 0) { // if 0 display all groups
      for (let i = 0, max = data.workingCount.length; i < max; ++i) {
        grRow.push(i + 1)
      }
    } else { // else return array of one group number
      grRow.push(group)
    }

    const isToday = today != null && today[0] === year && today[1] === month

    return <table id={`month_${year}-${month + 1}`} class={style.Main}>
      <caption class={isToday ? style.ThisMonth : null}>
        {monthNames[month]} {year}{isToday ? ' (Jetzt)' : ''}
      </caption>
      <thead>
        <tr>
          <th>Tag</th>
          <th />
          {grRow.map(gr => <th key={gr}>Gr. {gr}</th>)}
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

      <tfoot>
        <tr>
          <td
            class={style.WorkingDaysInfo}
            colSpan='2'
            title='Die Anzahl der Tage, an denen eine Schichtgruppe diesen Monat arbeitet.'
          >
            Anzahl
          </td>
          {grRow.map(gr => <td key={gr}>{data.workingCount[gr - 1]}</td>)}
        </tr>
      </tfoot>
    </table>
  }
}
