/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { Link } from 'preact-router'

export default function Footer () {
  return (
    <p class='mt-4 mb-3 text-center text-xs'>
      <b>Der inoffizielle Schichtkalender für Bosch Reutlingen.</b>
      <br />
      Made by Christopher Astfalk.
      <br />
      Dieser Kalender wird <strong><em>nicht</em></strong> von der Robert Bosch GmbH™️
      bereitgestellt. Robert Bosch GmbH™️ haftet nicht für den Inhalt dieser Seite.
      <br />
      Alle Angaben sind ohne Gewähr.
      <br />
      Alle Daten werden nur lokal gespeichert! Und nicht an einen Server übertragen.
      Deswegen gibt es keine Cookie Meldung.
      <br />
      {'Lizenz: '}
      <a
        href='https://www.mozilla.org/en-US/MPL/2.0/'
        class='inline-block text-blue-700 underline'
        target='_blank'
        rel='noopener noreferrer'
      >
        Mozilla Public License 2.0
      </a>
      <br />
      <Link
        class='inline-block text-blue-700 underline'
        href='/impressum/'
        tabIndex='0'
        onClick={() => {
          window.scrollTo(0, 0)
        }}
      >
        Impressum
      </Link>
    </p>
  )
}
