"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Link from "next/link";
import { type ShiftModelKeys } from "../../config/shifts";
import { shiftModelText } from "../../lib/constants";

import style from "../../styles/layout.module.css";

export type Settings = {
  didSelectModel: boolean;
  shiftModel: ShiftModelKeys;
  group: number;
};

export default function ShiftLink({ name }: { name: ShiftModelKeys }) {
  return (
    <li>
      <Link
        href={`/cal/${name}`}
        className={style.shift_button}
        onClick={() => {
          if (new URLSearchParams(window.location.search).has("pwa")) {
            const settings: Settings = JSON.parse(
              localStorage.getItem("settings") ?? "{}",
            );
            settings.didSelectModel = true;
            settings.shiftModel = name;
            settings.group = 0;
            localStorage.setItem("settings", JSON.stringify(settings));
          }
        }}
      >
        {shiftModelText[name]}
      </Link>
    </li>
  );
}
