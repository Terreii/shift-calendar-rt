/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useMemo } from "react";
import { shiftTitle, workingDescriptionId } from "../lib/constants";

import style from "./legend.module.css";

/**
 * Renders a legend of definitions for the table.
 * @returns {JSX.Element}
 */
export default function Legend() {
  return (
    <div className={style.container}>
      <dl className={style.column}>
        <Cell id={workingDescriptionId["F"]} description={shiftTitle.F}>
          F
        </Cell>

        <Cell id={workingDescriptionId["S"]} description={shiftTitle.S}>
          S
        </Cell>

        <Cell id={workingDescriptionId["N"]} description={shiftTitle.N}>
          N
        </Cell>
      </dl>

      <dl className={style.column}>
        <Cell
          className={style.closing}
          description="Schließtage (Ostern und Weihnachten)"
        />

        <Cell
          className={style.holiday}
          description="Schulferien / Feiertage in Baden-Württemberg"
          href="https://www.schulferien.org/Baden-Wurttemb_/baden-wurttemb_.html"
        />

        <Cell
          className={style.ramadan}
          description="Ramadan (erster / letzter Fastentag)"
          href="https://www.ramadan.de/wann-ist-ramadan/"
        />

        <Cell
          className={style.daylight_saving}
          description="Zeitumstellung"
          href="https://www.zeitumstellung.de/termin-zeitumstellung.html"
        />
      </dl>
    </div>
  );
}

/**
 * Legend of a cell for the table.
 * @param {Object} param  React params.
 * @param {string} [param.className]     ClassName of the example cell.
 * @param {string} param.description     Description of the cell shown.
 * @param {string} [param.href]          Info source URL.
 * @param {JSX.Element} [param.children] Content of the example cell.
 * @returns {JSX.Element}
 */
function Cell({ id, className, description, href, children }) {
  const descriptionElement = useMemo(() => {
    if (!description.includes("\n")) {
      return description;
    }

    return description
      .split(/\r?\n/)
      .flatMap((line, index) =>
        index === 0
          ? [<span key={index}>{line}</span>]
          : [<br key={index + "_br"} />, <span key={index}>{line}</span>],
      );
  }, [description]);

  return (
    <>
      <dt className={className ? `${style.cell} ${className}` : style.cell}>
        {children || "1"}
      </dt>

      <dd id={id} className={style.definition}>
        {href ? (
          <a href={href} className={style.link} rel="noopener noreferrer">
            {descriptionElement}
          </a>
        ) : (
          descriptionElement
        )}
      </dd>
    </>
  );
}
