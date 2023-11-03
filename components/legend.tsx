/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ReactNode } from "react";
import shifts, { type ShiftModelKeys } from "../config/shifts";

import style from "./legend.module.css";

/**
 * Renders a legend of definitions for the table.
 */
export default function Legend({ shiftKey }: { shiftKey: ShiftModelKeys }) {
  const shift = shifts[shiftKey];
  return (
    <div className={style.container}>
      <dl className={style.column}>
        {Object.entries(shift.shift).map(([key, data]) => (
          <Cell key={shiftKey + key} id={key}>
            {data.name}
            <br />
            {toTimeString(data.start)} - {toTimeString(data.end)} Uhr
          </Cell>
        ))}
      </dl>

      <dl className={style.column}>
        <Cell className={style.closing}>
          Schließtage (Ostern und Weihnachten)
        </Cell>

        <Cell
          className={style.holiday}
          href="https://www.schulferien.org/Baden-Wurttemb_/baden-wurttemb_.html"
        >
          Schulferien / Feiertage in Baden-Württemberg
        </Cell>

        <Cell
          className={style.ramadan}
          href="https://www.ramadan.de/wann-ist-ramadan/"
        >
          Ramadan (erster / letzter Fastentag)
        </Cell>

        <Cell
          className={style.daylight_saving}
          href="https://www.zeitumstellung.de/termin-zeitumstellung.html"
        >
          Zeitumstellung
        </Cell>
      </dl>
    </div>
  );
}

function toTimeString(time: [number, number]): string {
  return time[0] + ":" + String(time[1]).padStart(2, "0");
}

/**
 * Legend of a cell for the table.
 * @param   param  React params.
 * @param   param.className     ClassName of the example cell.
 * @param   param.id            Content of the example cell.
 * @param   param.href          Info source URL.
 * @param   param.children      Description of the cell shown.
 */
function Cell({
  id,
  className,
  href,
  children,
}: {
  id?: string;
  className?: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <dt className={className ? `${style.cell} ${className}` : style.cell}>
        {id || "1"}
      </dt>

      <dd
        id={id ? id + "_description" : undefined}
        className={style.definition}
      >
        {href ? (
          <a href={href} className={style.link} rel="noopener noreferrer">
            {children}
          </a>
        ) : (
          children
        )}
      </dd>
    </>
  );
}
