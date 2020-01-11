/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'

import MonthBody from './month-body.js'
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

  render ({ year, month, data, today, search, group }) {
    const groups = []

    if (group === 0) { // if 0 display all groups
      for (let i = 0, max = data.workingCount.length; i < max; ++i) {
        groups.push(i)
      }
    } else { // else return array of one group number
      groups.push(group - 1)
    }

    const isToday = today != null && today[0] === year && today[1] === month

    return <table
      id={`month_${year}-${month + 1}`}
      class=' mt-8 xl:mt-0 border border-black border-collapse text-center'
    >
      <caption
        class={isToday
          ? 'border border-b-0 border-black bg-gray-400 text-black font-bold'
          : 'font-bold'
        }
      >
        {monthNames[month]} {year}{isToday ? ' (Jetzt)' : ''}
      </caption>
      <thead>
        <tr>
          <th title='Woche'>Wo</th>
          <th title='Tag im Monat'>Tag</th>
          <th title='Wochentag' />
          {groups.map(gr => <th key={gr} aria-label={'Gruppe ' + (gr + 1)}>Gr. {gr + 1}</th>)}
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

      <tfoot class='text-sm font-bold'>
        <tr>
          <td
            class='border border-black p-1 cursor-help'
            colSpan='3'
            title='Die Anzahl der Tage, an denen eine Schichtgruppe diesen Monat arbeitet.'
          >
            Anzahl
          </td>
          {groups.map(gr => <td key={gr}>{data.workingCount[gr]}</td>)}
        </tr>
      </tfoot>
    </table>
  }
}
