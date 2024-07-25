/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ComponentChildren } from "preact";
import { useState, useId } from "preact/hooks";
import Helmet from "preact-helmet";
import downloadIcon from "bootstrap-icons/icons/download.svg";
import cloudDownloadIcon from "bootstrap-icons/icons/cloud-download.svg";
import sheetIcon from "bootstrap-icons/icons/file-spreadsheet.svg";

import {
  excelExportModelFullYearName,
  excelExportName,
  shiftModelNames,
  shiftModelText,
  monthNames,
} from "../../../lib/constants";
import { useSupportsInputType } from "../../hooks/utils";

import styles from "./style.module.css";

export default function DownloadPage() {
  const [yearMonth, setYearMonth] = useState(getToday);
  const [year, month] = yearMonth.split("-").map((v) => parseInt(v, 10));

  return (
    <main class={styles.main}>
      <Helmet title="Download" />

      <h1 class={styles.header}>
        Download Optionen
        {
          <img
            src={downloadIcon}
            width="32"
            height="32"
            alt=""
            class={styles.header_img}
          />
        }
      </h1>
      <label class={styles.month_label}>
        <span class={styles.month_label_text}>Für den Monat:</span>
        <MonthInput value={yearMonth} onChange={setYearMonth} />
      </label>

      <DownloadSection
        href={`/api/excel_export/all/${year}/${month}`}
        name={excelExportName(year, month)}
        alt={`Alle Schichten für ${monthNames[month - 1]} ${year} als Tabelle.`}
      >
        <strong>
          Alle Schichten für {monthNames[month - 1]} {year} als Tabelle:
        </strong>
      </DownloadSection>

      <h2 class={styles.header_2}>
        Tabellen für das ganze Jahr <em>{year}</em>
      </h2>

      {shiftModelNames.map((model) => (
        <DownloadSection
          key={model}
          href={`/api/excel_export/shift/${model}/${year}`}
          name={excelExportModelFullYearName(model, year)}
          alt={`Ganze Jahr ${year} für ${shiftModelText[model]}`}
        >
          <strong>{shiftModelText[model]}:</strong>
        </DownloadSection>
      ))}
    </main>
  );
}

function DownloadSection({
  href,
  name,
  alt,
  children,
}: {
  href: string;
  name: string;
  alt: string;
  children: ComponentChildren;
}) {
  return (
    <section class={styles.section}>
      {children}
      <a
        href={href}
        target="_blank"
        download={name}
        class={styles.sheet_download_link}
        title={`Download ${name}`}
        rel="noreferrer"
      >
        <img
          src={sheetIcon}
          width="32"
          height="32"
          alt={alt}
          class={styles.download_img}
        />
        <img
          src={cloudDownloadIcon}
          width="10"
          height="10"
          alt=""
          class={styles.download_arrow_img}
        />
      </a>
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
      class={styles.month_input}
      type="month"
      value={value}
      onInput={(event) =>
        (event.target as HTMLInputElement).value &&
        onChange((event.target as HTMLInputElement).value)
      }
    />
  ) : (
    <span class={styles.own_month_input}>
      <label htmlFor={`${id}year`}>Jahr:</label>
      <input
        id={`${id}year`}
        type="number"
        min="2010"
        max="2100"
        value={year}
        onInput={(event) =>
          onChange(`${(event.target as HTMLInputElement).value}-${month}`)
        }
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
        class={styles.today_btn}
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
