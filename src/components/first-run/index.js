/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import Footer from '../footer'
import { shiftModelNames, shiftModelText } from '../../lib/constants'

export default ({ onClick }) => (
  <div class={style.Main}>
    <h3>Willkommen zum inoffiziellen Schichtkalender für Reutlingen!</h3>

    <p>
      Welches Schichtmodell interessiert sie?
      <br />
      Sie können das Modell später jederzeit im Menü umändern.
    </p>

    <ul class={style.List}>
      {shiftModelNames.map(name => <li key={name}>
        <button onClick={() => { onClick(name) }}>
          {shiftModelText[name]}
        </button>
      </li>)}
    </ul>

    <Footer />
  </div>
)
