/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type JSX } from "preact";
import { useLocation } from "preact-iso";

import { useSupportsInputType } from "../../../hooks/utils";
import {
  monthNames,
  shiftModelNames,
  shiftModelText,
} from "../../../lib/constants";
import { getCalUrl } from "../../../lib/utils";
import { ShiftModelKeys } from "../../../config/shifts";

import style from "./style.module.css";
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
      <summary id="menu_summary" class={style.menu_button}>
        <img
          src={menuIcon}
          class={style.menu_button_img}
          height="45"
          width="45"
          alt="Menu"
        />
      </summary>
      <div
        key={show}
        id="hamburger_menu"
        aria-live="polite"
        aria-label="Menü"
        class={style.container}
      >
        <div class={style.scroll_container}>
          <div class={style.element_container}>
            {!(supportsMonthInput || isFullYear) && (
              <select
                class={style.month_select}
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
          </div>

          <div class={style.element_container}>
            {(!supportsMonthInput || isFullYear) && (
              <label class={style.label}>
                Jahr
                <input
                  class={style.form_item}
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
          </div>

          <div class={style.element_container}>
            {supportsMonthInput && !isFullYear && (
              <label class={style.label}>
                Gehe zum Monat
                <input
                  class={style.form_item}
                  type="month"
                  aria-controls="calendar_main_out"
                  min="1990-01"
                  value={`${year}-${String(month).padStart(2, "0")}`}
                  onInput={(event) => {
                    const value = (event.target as HTMLInputElement)
                      .valueAsDate;
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
          </div>

          <div class={style.element_container}>
            {supportsDateInput && (
              <label class={style.label}>
                Suche einen Tag
                <input
                  class={style.form_item}
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
          </div>

          <a
            key={isFullYear}
            href={getCalUrl({
              shiftModel,
              isFullYear: !isFullYear,
              year,
              month,
            })}
            class={style.month_full_year_toggle}
            aria-controls="calendar_main_out"
            onClick={() => {
              setShowMenu(false);
            }}
          >
            Zeige {isFullYear ? "Monate" : "ganzes Jahr"}
          </a>

          <label class={style.label}>
            Schichtmodell
            <select
              class={style.form_item}
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
            class={style.small_button}
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
