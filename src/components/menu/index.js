/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import { monthNames } from '../../lib/constants'

export default ({ show, month, year, isFullYear, toggleFullYear, gotoMonth }) => {
  return <div class={show ? style.Show : style.Menu}>
    <select
      title='Gehe zum Monat'
      value={month}
      onChange={event => {
        gotoMonth({ month: +event.target.value }, true)
      }}
    >
      {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
    </select>

    <label>
      Jahr
      <input
        type='number'
        min='2000'
        value={year}
        onChange={event => {
          const year = +event.target.value

          if (Number.isNaN(year)) return

          gotoMonth({ year }, false)
        }}
      />
    </label>

    <button onClick={toggleFullYear}>
      Zeige {isFullYear ? 'Monate' : 'ganzes Jahr'}
    </button>
  </div>
}
