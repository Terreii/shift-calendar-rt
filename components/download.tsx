/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Link from "next/link";
import {
  shiftModelText,
  shiftModelNames,
  shiftModelNumberOfGroups,
  excelExportName,
  excelExportModelFullYearName,
  type ShiftModels,
} from "../lib/constants";

import style from "./download.module.css";

export default function Download({
  shiftModel,
  year,
  month,
}: {
  shiftModel: ShiftModels;
  year: number;
  month?: number;
}) {
  if (!shiftModelNames.includes(shiftModel)) {
    return (
      <div className={style.container}>
        <section className={style.section}>
          Für dieses Schichtmodell sind die Kalender noch in Arbeit
          <SheetDownload
            shiftModel={shiftModel}
            year={year}
            month={month}
            inWork
          />
        </section>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <section className={style.section}>
        <h4 className={style.header}>
          Downloade einen {shiftModelText[shiftModel]} Kalender
        </h4>

        <p className={style.text}>
          Füge deine Schichtgruppe zu deiner Kalender-App hinzu!
        </p>

        <div className={style.link_list}>
          {Array.from({
            length: shiftModelNumberOfGroups[shiftModel] ?? 0,
          }).map((_, index) => {
            const group = index + 1;
            const host =
              process.env.NODE_ENV === "development"
                ? "localhost:" + (process.env.PORT ?? 3000)
                : globalThis.location?.origin ?? "schichtkalender.app";
            // https://stackoverflow.com/questions/5329529/i-want-html-link-to-ics-file-to-open-in-calendar-app-when-clicked-currently-op
            const href = `webcal://${host}/api/ics/${shiftModel}/${group}`;
            return (
              <a
                key={shiftModel + group}
                className="link"
                href={href}
                download={`${shiftModelText[shiftModel]} - Gruppe ${group}.ics`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Gruppe {group}
              </a>
            );
          })}
        </div>

        <SheetDownload shiftModel={shiftModel} year={year} month={month} />
      </section>
    </div>
  );
}

function SheetDownload({
  shiftModel,
  year,
  month,
  inWork = false,
}: {
  shiftModel: ShiftModels;
  year: number;
  month?: number;
  inWork?: boolean;
}) {
  const name = month
    ? excelExportName(year, month)
    : excelExportModelFullYearName(shiftModel, year);
  const url = month
    ? `/api/excel_export/all/${year}/${month}`
    : `/api/excel_export/shift/${shiftModel}/${year}`;

  return (
    <p className={style.text}>
      Oder lade ihn {inWork && "schon"} als Excel/
      <a
        href="https://de.libreoffice.org/discover/libreoffice/"
        target="_blank"
      >
        LibreOffice
      </a>{" "}
      Tabelle runter:
      <br />
      <a href={url} target="_blank" download={name} className="link">
        {name}
      </a>
      <br />
      <br />
      <Link href="/download">Es gibt mehr Download-Optionen!</Link>
    </p>
  );
}
