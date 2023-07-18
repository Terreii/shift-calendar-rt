/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import {
  shiftModelText,
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight,
  ShiftModels,
  excelExportName,
  excelExportModelFullYearName,
} from "../lib/constants";

import style from "./download.module.css";

const urls = {
  [shift66Name]: [
    "/assets/6-6_gruppe_1.ics",
    "/assets/6-6_gruppe_2.ics",
    "/assets/6-6_gruppe_3.ics",
    "/assets/6-6_gruppe_4.ics",
    "/assets/6-6_gruppe_5.ics",
    "/assets/6-6_gruppe_6.ics",
  ],
  [shift64Name]: [
    "/assets/6-4_gruppe_1.ics",
    "/assets/6-4_gruppe_2.ics",
    "/assets/6-4_gruppe_3.ics",
    "/assets/6-4_gruppe_4.ics",
    "/assets/6-4_gruppe_5.ics",
  ],
  [shiftWfW]: [
    "/assets/wfw_gruppe_1.ics",
    "/assets/wfw_gruppe_2.ics",
    "/assets/wfw_gruppe_3.ics",
    "/assets/wfw_gruppe_4.ics",
    "/assets/wfw_gruppe_5.ics",
    "/assets/wfw_gruppe_6.ics",
  ],
  [shiftAddedNight]: [
    "/assets/nacht_gruppe_1.ics",
    "/assets/nacht_gruppe_2.ics",
    "/assets/nacht_gruppe_3.ics",
  ],
};

export default function Download({
  shiftModel,
  year,
  month,
}: {
  shiftModel: ShiftModels;
  year: number;
  month?: number;
}) {
  if (!(shiftModel in urls)) {
    return (
      <div className={style.container}>
        <section className={style.section}>
          Für dieses Schichtmodell sind die Kalender noch in Arbeit
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
          {urls[shiftModel].map((href, index) => {
            const group = index + 1;
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
}: {
  shiftModel?: ShiftModels;
  year: number;
  month?: number;
}) {
  const name = month
    ? excelExportName(year, month)
    : excelExportModelFullYearName(shiftModel, year);
  const url = month
    ? `/api/excel_export/all/${year}/${month}`
    : `/api/excel_export/shift/${shiftModel}/${year}`;

  return (
    <p className={style.text}>
      Oder lade ihn als Excel/
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
    </p>
  );
}
