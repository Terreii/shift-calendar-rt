/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'

import {
  shiftModelText,
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight
} from '../lib/constants'

import cal66Group1 from '../assets/6-6_gruppe_1.ics'
import cal66Group2 from '../assets/6-6_gruppe_2.ics'
import cal66Group3 from '../assets/6-6_gruppe_3.ics'
import cal66Group4 from '../assets/6-6_gruppe_4.ics'
import cal66Group5 from '../assets/6-6_gruppe_5.ics'
import cal66Group6 from '../assets/6-6_gruppe_6.ics'

import cal64Group1 from '../assets/6-4_gruppe_1.ics'
import cal64Group2 from '../assets/6-4_gruppe_2.ics'
import cal64Group3 from '../assets/6-4_gruppe_3.ics'
import cal64Group4 from '../assets/6-4_gruppe_4.ics'
import cal64Group5 from '../assets/6-4_gruppe_5.ics'

import calWfwGroup1 from '../assets/wfw_gruppe_1.ics'
import calWfwGroup2 from '../assets/wfw_gruppe_2.ics'
import calWfwGroup3 from '../assets/wfw_gruppe_3.ics'
import calWfwGroup4 from '../assets/wfw_gruppe_4.ics'
import calWfwGroup5 from '../assets/wfw_gruppe_5.ics'
import calWfwGroup6 from '../assets/wfw_gruppe_6.ics'

import calNightGroup1 from '../assets/nacht_gruppe_1.ics'
import calNightGroup2 from '../assets/nacht_gruppe_2.ics'
import calNightGroup3 from '../assets/nacht_gruppe_3.ics'

const urls = {
  [shift66Name]: [
    cal66Group1,
    cal66Group2,
    cal66Group3,
    cal66Group4,
    cal66Group5,
    cal66Group6
  ],
  [shift64Name]: [
    cal64Group1,
    cal64Group2,
    cal64Group3,
    cal64Group4,
    cal64Group5
  ],
  [shiftWfW]: [
    calWfwGroup1,
    calWfwGroup2,
    calWfwGroup3,
    calWfwGroup4,
    calWfwGroup5,
    calWfwGroup6
  ],
  [shiftAddedNight]: [
    calNightGroup1,
    calNightGroup2,
    calNightGroup3
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
