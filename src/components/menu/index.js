/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import { monthNames } from '../../lib/constants'

const supportsMonthInput = (() => {
  const parent = document.createElement('div')
  const input = document.createElement('input')
  input.type = 'month'
  parent.appendChild(input)
  return parent.firstChild.type === 'month'
})()

export default ({ show, month, year, isFullYear, toggleFullYear, gotoMonth }) => {
  return <div class={show ? style.Show : style.Menu}>
    {supportsMonthInput || isFullYear
      ? null
      : <select
        title='Gehe zum Monat'
        value={month}
        onChange={event => {
          gotoMonth({ month: +event.target.value, toggleFullYear: true }, true)
        }}
      >
        {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
      </select>
    }

    {!supportsMonthInput || isFullYear
      ? <label>
        Jahr
        <input
          type='number'
          min='2000'
          value={year}
          onChange={event => {
            const year = +event.target.value

            if (Number.isNaN(year)) return

            gotoMonth({ year, toggleFullYear: !isFullYear }, false)
          }}
        />
      </label>
      : null
    }

    {supportsMonthInput && !isFullYear
      ? <label>
        Gehe zum Monat
        <input
          type='month'
          min='2000-01'
          value={`${year}-${String(month + 1).padStart(2, '0')}`}
          onChange={event => {
            const [year, month] = event.target.value.split('-').map(s => parseInt(s, 10))
            gotoMonth({ year, month: month - 1, toggleFullYear: true }, false)
          }}
        />
      </label>
      : null
    }

    <button onClick={toggleFullYear}>
      Zeige {isFullYear ? 'Monate' : 'ganzes Jahr'}
    </button>
  </div>
}
