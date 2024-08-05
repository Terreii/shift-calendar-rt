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

import Button from "../../components/button";

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
      class="p-0"
    >
      <h2 class="bg-emerald-900 px-4 py-2 text-2xl font-bold text-white">
        Downloade Tabelle
      </h2>

      <div class="flex flex-col gap-8 p-4">
        {link ? (
          <a
            href={link.url}
            download={link.name}
            target="_blank"
            rel="noreferrer"
            class="flex flex-row gap-2 text-lg underline hover:text-gray-500 focus-visible:text-gray-500 focus-visible:outline-none focus-visible:ring-2"
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
          <Button
            type="accept"
            onClick={(event) => {
              event.preventDefault();
              dialogRef.current?.close();
            }}
          >
            Schließen
          </Button>
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
