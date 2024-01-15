"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useId, ReactNode } from "react";
import Image from "next/image";
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
import { useSupportsInputType } from "../../../hooks/utils";

import styles from "../../../styles/download.module.css";

export default function DownloadPage() {
  const [yearMonth, setYearMonth] = useState(() => {
    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    return `${now.getUTCFullYear()}-${month}`;
  });
  const [year, month] = yearMonth.split("-").map((v) => parseInt(v, 10));

  return (
    <main className={styles.main}>
      <h1 className={styles.header}>
        Download Optionen{" "}
        {
          <Image
            src={downloadIcon}
            width="32"
            height="32"
            alt=""
            className={styles.inline_img}
          />
        }
      </h1>
      <label className={styles.month_label}>
        <span className={styles.month_label_text}>Für den Monat:</span>
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

      <h2 className={styles.header_2}>
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
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      {children}
      <a
        href={href}
        target="_blank"
        download={name}
        className={styles.sheet_download_link}
        title={`Download ${name}`}
      >
        <Image
          src={sheetIcon}
          width="32"
          height="32"
          alt={alt}
          className={styles.download_img}
        />
        <Image
          src={cloudDownloadIcon}
          width="10"
          height="10"
          alt=""
          className={styles.download_arrow_img}
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
      className={styles.month_input}
      type="month"
      value={value}
      onChange={(event) => event.target.value && onChange(event.target.value)}
    />
  ) : (
    <span className={styles.own_month_input}>
      <label htmlFor={id + "year"}>Jahr:</label>
      <input
        id={id + "year"}
        type="number"
        min="2010"
        max="2100"
        value={year}
        onChange={(event) => onChange(`${event.target.value}-${month}`)}
      />

      <label htmlFor={id + "month"}>Monat:</label>
      <select
        id={id + "month"}
        value={month}
        onChange={(event) => onChange(`${year}-${event.target.value}`)}
      >
        {monthNames.map((name, i) => (
          <option key={i} value={String(i + 1).padStart(2, "0")}>
            {name}
          </option>
        ))}
      </select>
    </span>
  );
}
