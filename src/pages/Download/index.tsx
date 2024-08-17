/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import classNames from "classnames";
import { type ComponentChildren } from "preact";
import { Suspense } from "preact/compat";
import { useState, useId } from "preact/hooks";
import { lazy } from "preact-iso";
import Helmet from "preact-helmet";
import calendarPlus from "bootstrap-icons/icons/calendar-plus-fill.svg";
import cloudDownloadIcon from "bootstrap-icons/icons/cloud-download.svg";
import downloadIcon from "bootstrap-icons/icons/download.svg";
import sheetIcon from "bootstrap-icons/icons/file-spreadsheet.svg";

import {
  excelExportModelFullYearName,
  excelExportName,
  shiftModelNames,
  shiftModelText,
  monthNames,
  shiftModelNumberOfGroups,
} from "../../../lib/constants";
import { useSupportsInputType } from "../../hooks/utils";
import { acceptClasses, cancelClasses } from "../../components/button";

import { type ModelToShow } from "./Dialog";

const DownloadDialog = lazy(() =>
  import("./Dialog").then((im) => im.DownloadDialog),
);

export default function DownloadPage() {
  const [yearMonth, setYearMonth] = useState(getToday);
  const [dialog, setDialog] = useState<ModelToShow | null>(null);
  const [year, month] = yearMonth.split("-").map((v) => parseInt(v, 10));

  return (
    <main class="mx-auto mb-20 mt-8 max-w-fit rounded p-4 text-gray-900">
      <Helmet title="Download" />

      <h1 class="mb-5 text-4xl font-bold">
        Download Optionen
        {
          <img
            src={downloadIcon}
            width="32"
            height="32"
            alt=""
            class="ml-2 inline-block"
          />
        }
      </h1>
      <section>
        <h2 class="mt-8 text-2xl font-bold">
          ICS (Für Kalender Apps){" "}
          <img class="ml-2 inline-block size-6" src={calendarPlus} alt="" />
        </h2>
        <p class="my-2 text-gray-600">
          Füge deine Schicht zu deiner Kalender App hinzu.
          <br />
          Z.B.: Kalender auf dem iPhone, Google Kalender oder Outlook.
        </p>

        {shiftModelNames.map((model) => (
          <div
            key={model}
            class="mt-4 flex flex-col border-b border-gray-400 pb-2 last:border-b-0 last:pb-0"
          >
            <strong>{shiftModelText[model]}</strong>
            <div class="mt-2 flex w-full flex-row items-center gap-6">
              <span class="text-gray-600">Gruppen:</span>
              {Array.from({ length: shiftModelNumberOfGroups[model] }).map(
                (_, gr) => (
                  <button
                    key={gr}
                    type="button"
                    class={classNames("size-10", cancelClasses)}
                    onClick={(event) => {
                      event.preventDefault();
                      setDialog({ type: "ics", model, group: gr });
                    }}
                  >
                    {gr + 1}
                  </button>
                ),
              )}
            </div>
          </div>
        ))}
      </section>

      <h2 class="mt-8 text-2xl font-bold">Excel/LibreOffice Tabellen</h2>
      <label class="mb-4 block">
        <span class="me-2">Für den Monat:</span>
        <MonthInput value={yearMonth} onChange={setYearMonth} />
      </label>

      <DownloadSection
        name={excelExportName(year, month)}
        isLast
        alt={`Alle Schichten für ${monthNames[month - 1]} ${year} als Tabelle.`}
        onClickArg={{ type: "all_in_month", year, month }}
        onClick={setDialog}
      >
        <strong>
          Alle Schichten für {monthNames[month - 1]} {year} als Tabelle:
        </strong>
      </DownloadSection>

      <h3 class="mt-8 text-xl font-bold">
        Tabellen für das ganze Jahr <em>{year}</em>
      </h3>

      {shiftModelNames.map((model, index, all) => (
        <DownloadSection
          key={model}
          name={excelExportModelFullYearName(model, year)}
          alt={`Ganze Jahr ${year} für ${shiftModelText[model]}`}
          isLast={index + 1 === all.length}
          onClickArg={{ type: "model_year", model, year }}
          onClick={setDialog}
        >
          <strong>{shiftModelText[model]}:</strong>
        </DownloadSection>
      ))}

      {dialog && (
        <Suspense fallback={<div />}>
          <DownloadDialog data={dialog} onClose={() => setDialog(null)} />
        </Suspense>
      )}
    </main>
  );
}

function DownloadSection({
  name,
  alt,
  isLast,
  onClickArg,
  onClick,
  children,
}: {
  name: string;
  alt: string;
  isLast?: boolean;
  onClickArg: ModelToShow;
  onClick: (arg: ModelToShow) => void;
  children: ComponentChildren;
}) {
  return (
    <section
      class={classNames(
        "mt-4 flex flex-row items-center justify-between border-b border-gray-400",
        { "border-b-0": isLast },
      )}
    >
      {children}
      <button
        type="button"
        class="relative ml-4 cursor-pointer border-0 bg-transparent hover:shadow hover:sepia focus-visible:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:sepia"
        title={`Download ${name}`}
        onClick={(event) => {
          event.preventDefault();
          onClick(onClickArg);
        }}
      >
        <img
          src={sheetIcon}
          width="32"
          height="32"
          alt={alt}
          class="inline"
          style={{
            filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(75deg)",
          }}
        />
        <img
          src={cloudDownloadIcon}
          width="10"
          height="10"
          alt=""
          class="absolute -left-1 bottom-0 size-5"
        />
      </button>
    </section>
  );
}

function MonthInput({
  value,
  onChange,
}: {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}) {
  const id = useId();
  const supportsMonth = useSupportsInputType("month");
  const [year, month] = value.split("-");
  return supportsMonth ? (
    <input
      class="ms-24 inline-block"
      type="month"
      value={value}
      min="2010-01"
      max="2100-12"
      onInput={(event) =>
        (event.target as HTMLInputElement).value &&
        onChange((event.target as HTMLInputElement).value)
      }
    />
  ) : (
    <span class="mt-1 grid gap-2 rounded border border-gray-400 p-2">
      <label htmlFor={`${id}year`}>Jahr:</label>
      <input
        id={`${id}year`}
        type="number"
        min="2010"
        max="2100"
        value={year}
        onInput={(event) => {
          const year = (event.target as HTMLInputElement).valueAsNumber;
          onChange(`${Math.max(Math.min(2100, year), 2010)}-${month}`);
        }}
      />

      <label htmlFor={`${id}month`}>Monat:</label>
      <select
        id={`${id}month`}
        value={month}
        onInput={(event) =>
          onChange(`${year}-${(event.target as HTMLInputElement).value}`)
        }
      >
        {monthNames.map((name, i) => (
          <option key={i} value={String(i + 1).padStart(2, "0")}>
            {name}
          </option>
        ))}
      </select>

      <button
        type="button"
        class={classNames(acceptClasses, "col-start-2 ml-auto w-min self-end")}
        onClick={() => onChange(getToday())}
      >
        Heute
      </button>
    </span>
  );
}

function getToday(): string {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${now.getUTCFullYear()}-${month}`;
}
