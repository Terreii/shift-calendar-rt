/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from './prompts.module.css'

export default function Confirm ({ children, confirmText, onClick }) {
  return (
    <aside className={style.container}>
      <div className={style.content}>
        {children}
      </div>

      <div className={style.buttons_row}>
        <button
          type='button'
          className={style.accept_button}
          onClick={() => {
            onClick(true)
          }}
        >
          {confirmText}
        </button>
        <button
          type='button'
          onClick={() => {
            onClick(false)
          }}
          title='Klicke um den Kalender nicht zu installieren'
          className={style.cancel_button}
        >
          Abbrechen
        </button>
      </div>
    </aside>
  )
}
