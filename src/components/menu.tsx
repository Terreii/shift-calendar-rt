/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type JSX } from "preact";
import { useLocation } from "preact-iso";

import { useSupportsInputType } from "../hooks/utils";
import {
  monthNames,
  shiftModelNames,
  shiftModelText,
} from "../../lib/constants";
import { getCalUrl } from "../../lib/utils";
import { ShiftModelKeys } from "../../lib/shifts";

import menuIcon from "bootstrap-icons/icons/three-dots-vertical.svg";
import shareIcon from "bootstrap-icons/icons/share-fill.svg";

export default function Menu({
  show,
  month,
  year,
  isFullYear,
  search,
  shiftModel,
  setShowMenu,
  onShare,
}: {
  show: boolean;
  month: number;
  year: number;
  isFullYear: boolean;
  search?: number | string | null;
  shiftModel: ShiftModelKeys;
  setShowMenu: (boolean) => void;
  onShare: (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => void;
}) {
  const { route } = useLocation();
  const supportsMonthInput = useSupportsInputType("month");
  const supportsDateInput = useSupportsInputType("date");

  let searchValue = "";
  if (search != null) {
    const searchMonth = String(month).padStart(2, "0");
    const searchDay = String(search).padStart(2, "0");
    searchValue = `${year}-${searchMonth}-${searchDay}`;
  }

  return (
    <details
      open={show}
      onToggle={(event) => {
        setShowMenu((event.target! as HTMLDetailsElement).open);
      }}
    >
      <summary
        id="menu_summary"
        class="flex w-16 cursor-pointer list-none items-center justify-center bg-transparent hover:bg-emerald-600 focus-visible:bg-emerald-600 focus-visible:ring-2 focus-visible:outline-hidden"
      >
        <img src={menuIcon} class="invert" height="45" width="45" alt="Menu" />
      </summary>
      <div
        key={show}
        id="hamburger_menu"
        aria-live="polite"
        aria-label="Menü"
        class="right-safe-offset-0 top-safe-offset-12 absolute overflow-y-visible overscroll-contain bg-emerald-900 text-white shadow-lg"
      >
        <div class="-max-h-screen-safe-offset-12 flex flex-col items-stretch justify-center p-3">
          {!(supportsMonthInput || isFullYear) && (
            <select
              class="btn h-10"
              title="Gehe zum Monat"
              value={month}
              onChange={(event) => {
                route(
                  getCalUrl({
                    shiftModel,
                    isFullYear: false,
                    month: +(event.target! as HTMLSelectElement).value,
                    year,
                  }),
                );
              }}
              aria-controls="calendar_main_out"
            >
              {monthNames.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {(!supportsMonthInput || isFullYear) && (
            <label class="mt-5 flex flex-col items-stretch text-center text-white first:mt-0">
              Jahr
              <input
                class="btn mt-1 h-10 flex-auto"
                type="number"
                min={1990}
                aria-controls="calendar_main_out"
                defaultValue={year.toString()}
                onInput={(event) => {
                  const year = (event.target! as HTMLInputElement)
                    .valueAsNumber;
                  if (Number.isNaN(year) || year < 1990) return;
                  route(
                    getCalUrl({
                      shiftModel,
                      isFullYear,
                      year,
                      month,
                    }),
                  );
                }}
              />
            </label>
          )}

          {supportsMonthInput && !isFullYear && (
            <label class="mt-5 flex flex-col items-stretch text-center text-white first:mt-0">
              Gehe zum Monat
              <input
                class="btn mt-1 h-10 flex-auto"
                type="month"
                aria-controls="calendar_main_out"
                min="1990-01"
                value={`${year}-${String(month).padStart(2, "0")}`}
                onInput={(event) => {
                  const value = (event.target as HTMLInputElement).valueAsDate;
                  if (value == null) return;

                  route(
                    getCalUrl({
                      shiftModel,
                      isFullYear,
                      month: value.getMonth() + 1,
                      year: value.getFullYear(),
                    }),
                  );
                }}
              />
            </label>
          )}

          {supportsDateInput && (
            <label class="mt-5 flex flex-col items-stretch text-center text-white">
              Suche einen Tag
              <input
                class="btn mt-1 h-10 flex-auto"
                type="date"
                aria-controls="calendar_main_out"
                min="1990-01-01"
                defaultValue={searchValue}
                onInput={(event) => {
                  const value = (event.target! as HTMLInputElement).value;

                  if (value == null || value.length === 0) {
                    route(
                      getCalUrl({
                        shiftModel,
                        isFullYear,
                        month,
                        year,
                      }),
                    );
                  } else {
                    const date =
                      (event.target! as HTMLInputElement).valueAsDate ||
                      new Date(value);
                    route(
                      getCalUrl({
                        shiftModel,
                        isFullYear: false,
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                      }),
                    );
                  }
                }}
              />
            </label>
          )}

          <a
            key={isFullYear}
            href={getCalUrl({
              shiftModel,
              isFullYear: !isFullYear,
              year,
              month,
            })}
            class="btn mt-5 py-2"
            aria-controls="calendar_main_out"
            onClick={() => {
              setShowMenu(false);
            }}
          >
            Zeige {isFullYear ? "Monate" : "ganzes Jahr"}
          </a>

          <label class="mt-5 flex flex-col items-stretch text-center text-white">
            Schichtmodell
            <select
              class="btn mt-1 h-10 flex-auto"
              aria-controls="calendar_main_out"
              value={shiftModel}
              onChange={(event) => {
                route(
                  getCalUrl({
                    shiftModel: (event.target! as HTMLSelectElement)
                      .value as ShiftModelKeys,
                    isFullYear,
                    year,
                    month,
                  }),
                );
              }}
            >
              {shiftModelNames.map((model) => (
                <option key={model} value={model}>
                  {shiftModelText[model] || model}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            class="btn mx-auto mt-5 h-12 px-4 py-2"
            onClick={onShare}
            aria-label="Teile deine Schicht"
          >
            <img src={shareIcon} height="32" width="32" alt="teilen" />
          </button>
        </div>
      </div>
    </details>
  );
}
