/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from "./prompts.module.css";
import formStyles from "../styles/form.module.css";

export default function Confirm({ children, confirmText, onClick }) {
  return (
    <aside className={style.container}>
      <div className={style.content}>{children}</div>

      <div className={style.buttons_row}>
        <button
          type="button"
          className={formStyles.accept_button_with_img}
          onClick={() => {
            onClick(true);
          }}
        >
          {confirmText}
        </button>
        <button
          type="button"
          onClick={() => {
            onClick(false);
          }}
          title="Klicke um den Kalender nicht zu installieren"
          className={formStyles.cancel_button}
        >
          Abbrechen
        </button>
      </div>
    </aside>
  );
}
