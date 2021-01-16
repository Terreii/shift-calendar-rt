/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import {
  shiftModelText,
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight
} from '../lib/constants'

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

export default function Download ({ shiftModel }) {
  if (!(shiftModel in urls)) {
    return (
      <div className='p-4 mx-auto my-4 text-center text-gray-900 bg-gray-300 rounded'>
        Für dieses Schichtmodell sind die Kalender noch in Arbeit
      </div>
    )
  }

  return (
    <div className='flex flex-col px-1 my-4'>
      <section className='p-4 pt-2 mx-auto text-center text-gray-900 bg-gray-300 rounded'>
        <h4 className='text-xl font-semibold'>Downloade einen {shiftModelText[shiftModel]} Kalender</h4>

        <p className='py-2'>Füge deine Schichtgruppe zu deiner Kalender-App hinzu!</p>

        {urls[shiftModel].map((href, index) => {
          const group = index + 1
          return (
            <a
              key={shiftModel + group}
              className={'inline-block text-blue-800 underline py-3 px-1' +
                (index === 0 ? '' : ' ml-2')}
              href={href}
              download={`${shiftModelText[shiftModel]} - Gruppe ${group}.ics`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Gruppe {group}
            </a>
          )
        })}
      </section>
    </div>
  )
}
