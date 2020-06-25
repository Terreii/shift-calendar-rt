/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { html } from '../preact.js'

import Footer from './footer.js'
import { shiftModelNames, shiftModelText } from '../lib/constants.js'

export default function FirstRun ({ onClick }) {
  return html`
    <div class="fixed top-0 pt-16 text-center w-screen h-screen bg-gray-100">
      <h3>Willkommen zum inoffiziellen Schichtkalender für Bosch Reutlingen!</h3>

      <p>
        Welches Schichtmodell interessiert sie?
        <br />
        Sie können das Modell später jederzeit im Menü
        <img
          class="inline-block ml-1 mr-2"
          src="/assets/icons/hamburger_icon.svg"
          height="20"
          width="20"
          alt="das Menü ist oben rechts"
        />
        umändern.
      </p>

      <ul class="list-none flex flex-col justify-center w-64 mt-2 mb-16 mx-auto p-0">
        ${shiftModelNames.map((name, index) => html`
          <li
            key=${name}
            class=${index > 0 ? 'mt-3' : ''}
          >
            <button
              class=${'inline-block mx-3 py-1 px-4 h-10 w-full border-0 bg-indigo-700 text-white' +
                ' text-center rounded shadow hover:bg-indigo-800 focus:bg-indigo-800 ' +
                'focus:shadow-outline'}
              onClick=${() => { onClick(name) }}
            >
              ${shiftModelText[name]}
            </button>
          </li>
        `)}
      </ul>

      <${Footer} />
    </div>
  `
}
