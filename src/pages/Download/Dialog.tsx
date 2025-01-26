/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { createEvents } from "ics";
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
import { getShiftsList } from "../../../lib/workdata";

import Button from "../../components/button";

type IcsData = { type: "ics"; model: ShiftModelKeys; group: number };

export type ModelToShow =
  | IcsData
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
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(
    () =>
      data.type === "ics"
        ? createIcsLink(data, setLink, setError)
        : createLink(data, setLink, setError),
    [data],
  );
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
        Downloade {data.type === "ics" ? "Kalender Datei" : "Tabelle"}
      </h2>

      <div class="flex flex-col gap-8 p-4">
        {link ? (
          <a
            href={link.url}
            download={link.name}
            target="_blank"
            rel="noreferrer"
            class="flex flex-row gap-2 text-lg underline hover:text-gray-500 focus-visible:text-gray-500 focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <img src={cloudDownloadIcon} width="20" height="20" alt="" />
            <span>
              Download <strong>{link.name}</strong>
            </span>
          </a>
        ) : error ? (
          <span class="font-bold text-red-600">{error}</span>
        ) : (
          <span>Erstelle Datei...</span>
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

function createIcsLink(
  data: IcsData,
  setLink: Dispatch<StateUpdater<State | null>>,
  setError: Dispatch<StateUpdater<string | null>>,
): (() => void) | void {
  if (data.type !== "ics") return;
  setLink(null);

  let isActive = true;
  let url: string | null = null;
  const fileName = `${shiftModelText[data.model]} - Gruppe ${data.group + 1}.ics`;
  const events = getShiftsList(
    data.model,
    data.group,
    new Date().getFullYear(),
  );

  createEvents(events, (error, body) => {
    if (error) {
      console.error(error);
      setError(error.message);
      setLink(null);
      return;
    }
    if (!isActive) return;

    const file = new File([body], fileName, { type: "text/calendar" });
    url = URL.createObjectURL(file);
    setLink({ url, name: fileName });
  });

  return () => {
    isActive = false;
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
}

function createLink(
  data: ModelToShow,
  setLink: Dispatch<StateUpdater<State | null>>,
  setError: Dispatch<StateUpdater<string | null>>,
): (() => void) | void {
  setLink(null);
  setError(null);

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
