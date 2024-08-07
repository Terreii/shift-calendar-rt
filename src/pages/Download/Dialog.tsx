/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import xl from "excel4node";
import cloudDownloadIcon from "bootstrap-icons/icons/cloud-download.svg";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";
import {
  monthNames,
  shiftModelNames,
  shiftModelText,
  excelExportName,
  excelExportModelFullYearName,
} from "../../../lib/constants";
import { createShiftSheet, createStyles } from "../../../lib/excel_export";
import { type ShiftModelKeys } from "../../../lib/shifts";

import styles from "./style.module.css";
import formStyles from "../../form.module.css";

export type ModelToShow =
  | { type: "all_in_month"; year: number; month: number }
  | { type: "model_year"; model: ShiftModelKeys; year: number };

type State = { url: string; name: string };

export function DownloadDialog({
  data,
  onClose,
}: {
  data: ModelToShow;
  onClose: () => void;
}) {
  const [link, setLink] = useState<State | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => createLink(data, setLink), [data]);
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        onClose();
      }}
      class={styles.dialog}
    >
      <h2>Downloade Tabelle</h2>

      <div class={styles.dialog_body}>
        {link ? (
          <a
            href={link.url}
            download={link.name}
            target="_blank"
            rel="noreferrer"
            class={styles.sheet_download_link}
          >
            <img src={cloudDownloadIcon} width="20" height="20" alt="" />
            <span>
              Download <strong>{link.name}</strong>
            </span>
          </a>
        ) : (
          <span>Erstelle Tabelle...</span>
        )}

        <div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              dialogRef.current?.close();
            }}
            class={formStyles.button}
          >
            Schließen
          </button>
        </div>
      </div>
    </dialog>
  );
}

function createLink(
  data: ModelToShow,
  setLink: Dispatch<StateUpdater<State | null>>,
): (() => void) | void {
  setLink(null);

  let isActive = true;
  let url: string | null = null;
  const type = data.type;
  if (type !== "all_in_month" && type !== "model_year") return;

  const wb = new xl.Workbook();
  const styles = createStyles(wb);

  let name = "";
  if (type === "all_in_month") {
    for (const model of shiftModelNames) {
      createShiftSheet(
        wb.addWorksheet(shiftModelText[model]),
        model,
        data.year,
        data.month,
        styles,
      );
    }
    name = excelExportName(data.year, data.month);
  } else if (type === "model_year") {
    for (let i = 0; i < 12; i++) {
      createShiftSheet(
        wb.addWorksheet(monthNames[i]),
        data.model,
        data.year,
        i + 1,
        styles,
      );
    }
    name = excelExportModelFullYearName(data.model, data.year);
  }

  wb.writeToBuffer().then((buffer: Buffer) => {
    if (!isActive) return;
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    url = URL.createObjectURL(blob);
    setLink({ url, name });
  });

  const unload = () => {
    isActive = false;
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
  window.addEventListener("beforeunload", unload);
  return () => {
    unload();
    window.removeEventListener("beforeunload", unload);
  };
}
