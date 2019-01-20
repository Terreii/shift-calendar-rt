/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

export default ({ show, isFullYear, toggleFullYear }) => {
  return <div class={show ? style.Show : style.Menu}>
    <button onClick={toggleFullYear}>
      Zeige {isFullYear ? 'Monate' : 'ganzes Jahr'}
    </button>
  </div>
}
