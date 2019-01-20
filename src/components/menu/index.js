/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import { monthNames } from '../../lib/constants'

export default ({ show, isFullYear, toggleFullYear, gotoMonth }) => {
  return <div class={show ? style.Show : style.Menu}>
    <select
      title='Gehe zum Monat'
      onChange={event => { gotoMonth(+event.target.value) }}
    >
      {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
    </select>

    <button onClick={toggleFullYear}>
      Zeige {isFullYear ? 'Monate' : 'ganzes Jahr'}
    </button>
  </div>
}
