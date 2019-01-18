/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

export default ({ show }) => {
  return <div class={show ? `${style.Menu} ${style.Show}` : style.Menu}>
    <button>Test</button>
  </div>
}
