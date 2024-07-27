/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

import { type ShiftModelKeys } from "../../../lib/shifts";
import { shiftModelNames, shiftModelText } from "../../../lib/constants";
import { getToday, getTodayUrl } from "../../../lib/utils";

import menuIcon from "bootstrap-icons/icons/three-dots-vertical.svg";
import style from "./style.module.css";

type Settings = {
  didSelectModel: boolean;
  shiftModel: ShiftModelKeys;
  group: number;
};

export default function Index() {
  return (
    <main class={style.main}>
      <Redirector />

      <div id="calendar_main_out">
        <h2>
          Willkommen zum inoffiziellen Schichtkalender für Bosch Reutlingen!
        </h2>

        <div>
          Welches Schichtmodell interessiert sie?
          <br />
          Sie können das Modell später jederzeit im{" "}
          <span class={style.no_break}>
            Menü
            <img
              class={style.inline_menu_icon}
              src={menuIcon}
              height="20"
              width="20"
              alt="das Menü ist oben rechts"
            />
          </span>
          umändern.
        </div>

        <ul class={style.shift_button_list}>
          {shiftModelNames.map((name) => (
            <ShiftLink key={name} name={name} />
          ))}
        </ul>
      </div>
    </main>
  );
}

function ShiftLink({ name }: { name: ShiftModelKeys }) {
  return (
    <li>
      <a
        href={`/cal/${name}`}
        class={style.shift_button}
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
      </a>
    </li>
  );
}

function Redirector() {
  const { route } = useLocation();

  useEffect(() => {
    const settings: Settings = JSON.parse(
      localStorage.getItem("settings") ?? "{}",
    );
    if (
      new URLSearchParams(window.location.search).has("pwa") &&
      settings.shiftModel
    ) {
      route(
        getTodayUrl({
          shiftModel: settings.shiftModel,
          group: 0,
          today: getToday(),
        }),
        true,
      );
    }
  }, [route]);

  return null;
}
