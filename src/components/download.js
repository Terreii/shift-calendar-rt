/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from '../web_modules/preact.js'

import {
  shiftModelText,
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight
} from '../lib/constants.js'

const urls = {
  [shift66Name]: [
    '/assets/6-6_gruppe_1.ics',
    '/assets/6-6_gruppe_2.ics',
    '/assets/6-6_gruppe_3.ics',
    '/assets/6-6_gruppe_4.ics',
    '/assets/6-6_gruppe_5.ics',
    '/assets/6-6_gruppe_6.ics'
  ],
  [shift64Name]: [
    '/assets/6-4_gruppe_1.ics',
    '/assets/6-4_gruppe_2.ics',
    '/assets/6-4_gruppe_3.ics',
    '/assets/6-4_gruppe_4.ics',
    '/assets/6-4_gruppe_5.ics'
  ],
  [shiftWfW]: [
    '/assets/wfw_gruppe_1.ics',
    '/assets/wfw_gruppe_2.ics',
    '/assets/wfw_gruppe_3.ics',
    '/assets/wfw_gruppe_4.ics',
    '/assets/wfw_gruppe_5.ics',
    '/assets/wfw_gruppe_6.ics'
  ],
  [shiftAddedNight]: [
    '/assets/nacht_gruppe_1.ics',
    '/assets/nacht_gruppe_2.ics',
    '/assets/nacht_gruppe_3.ics'
  ]
}

export default ({ shiftModel }) => {
  if (!(shiftModel in urls)) {
    return <div class='my-4 mx-auto p-4 text-center bg-gray-400 text-gray-900 rounded'>
      Für dieses Schichtmodell sind die Kalender noch in Arbeit
    </div>
  }

  return <div
    class='my-4 mx-auto p-4 pt-2 text-center bg-gray-400 text-gray-900 rounded'
  >
    <h4 class='text-xl font-semibold'>Downloade einen {shiftModelText[shiftModel]} Kalender</h4>

    <p class='py-2'>Füge deine Schichtgruppe zu deiner Kalender-App hinzu!</p>

    {urls[shiftModel].map((href, index) => {
      const group = index + 1
      return <a
        key={shiftModel + group}
        class={'inline-block text-blue-800 underline' + (index === 0 ? '' : ' ml-2')}
        href={href}
        download={`${shiftModelText[shiftModel]} - Gruppe ${group}.ics`}
        target='_blank'
      >
        Gruppe {group}
      </a>
    })}
  </div>
}
