/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  shiftModelNames,
  shiftModelText,
  type ShiftModels,
} from "../../lib/constants";
import { getToday, getTodayUrl } from "../../lib/utils";

import hamburgerIcon from "../../public/assets/icons/hamburger_icon.svg";
import style from "../../styles/layout.module.css";

export default function Index({
  searchParams,
}: {
  searchParams?: { pwa: string };
}) {
  const cookieStore = cookies();
  const shift = cookieStore.get("shift_model");

  if (
    searchParams?.pwa != null &&
    shift &&
    shiftModelNames.includes(shift?.value as ShiftModels)
  ) {
    const today = getToday();
    redirect(
      getTodayUrl({
        shiftModel: shift.value,
        today,
        group: 0,
      }),
    );
  }

  return (
    <main className={style.main}>
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
            <li key={name}>
              <Link href={`/cal/${name}`} className={style.shift_button}>
                {shiftModelText[name]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
