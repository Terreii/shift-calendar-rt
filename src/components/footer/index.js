/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style.less'

export default () => {
  return <p class={style.Footer}>
    Der inoffizielle Schichtkalender für Bosch Reutlingen.
    <br />
    Made by Christopher Astfalk.
    <br />
    {'Lizenz: '}
    <a href='https://www.mozilla.org/en-US/MPL/2.0/' target='_blank' rel='noopener'>
      Mozilla Public License 2.0.
    </a>
    <br />
    <Link
      class={style.ImpressumLink}
      href='/impressum/'
      tabIndex='0'
      onClick={() => {
        window.scrollTo(0, 0)
      }}
    >
      Impressum
    </Link>
  </p>
}
