/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Image from "next/image";

import { shiftModelNames } from "../../lib/constants";

import hamburgerIcon from "../../public/assets/icons/hamburger_icon.svg";
import style from "../../styles/layout.module.css";
import Redirector from "./redirector";
import ShiftLink from "./shiftLink";

export const dynamic = "force-static";

export default function Index() {
  return (
    <main className={style.main}>
      <Redirector />

      <div id="calendar_main_out">
        <h2>
          Willkommen zum inoffiziellen Schichtkalender für Bosch Reutlingen!
        </h2>

        <div>
          Welches Schichtmodell interessiert sie?
          <br />
          Sie können das Modell später jederzeit im{" "}
          <span className={style.no_break}>
            Menü
            <Image
              className={style.inline_menu_icon}
              src={hamburgerIcon}
              height="20"
              width="20"
              alt="das Menü ist oben rechts"
            />
          </span>
          umändern.
        </div>

        <ul className={style.shift_button_list}>
          {shiftModelNames.map((name) => (
            <ShiftLink key={name} name={name} />
          ))}
        </ul>
      </div>
    </main>
  );
}
