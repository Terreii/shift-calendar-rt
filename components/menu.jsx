"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  monthNames,
  shiftModelNames,
  shiftModelText,
  shiftModelNumberOfGroups,
} from "../lib/constants";
import { getCalUrl } from "../lib/utils";
import { useSupportsInputType } from "../hooks/utils";

import style from "./menu.module.css";

export default function Menu({
  show,
  month,
  year,
  isFullYear,
  search,
  group,
  shiftModel,
  setShowMenu,
  onShare,
}) {
  const router = useRouter();
  const supportsMonthInput = useSupportsInputType("month");
  const supportsDateInput = useSupportsInputType("date");

  let searchValue = "";
  if (search != null) {
    const searchMonth = String(month).padStart(2, "0");
    const searchDay = String(search).padStart(2, "0");
    searchValue = `${year}-${searchMonth}-${searchDay}`;
  }

  const groupOptions = [];
  for (
    let gr = 1, max = shiftModelNumberOfGroups[shiftModel] || 1;
    gr <= max;
    gr += 1
  ) {
    groupOptions.push(
      <option key={"group_" + gr} value={gr}>
        Nur Gruppe {gr}
      </option>,
    );
  }

  return (
    <details
      open={show}
      onToggle={(event) => {
        setShowMenu(event.target.open);
      }}
    >
      <summary id="menu_summary" className={style.menu_button}>
        <Image
          src="/assets/icons/hamburger_icon.svg"
          className={style.menu_button_img}
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
        className={style.container}
      >
        <div className={style.scroll_container}>
          <div className={style.element_container}>
            {!(supportsMonthInput || isFullYear) && (
              <select
                className={style.month_select}
                title="Gehe zum Monat"
                value={month}
                onChange={(event) => {
                  router.push(
                    getCalUrl({
                      group,
                      shiftModel,
                      isFullYear: false,
                      month: +event.target.value,
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

          <div className={style.element_container}>
            {(!supportsMonthInput || isFullYear) && (
              <label className={style.label}>
                Jahr
                <input
                  className={style.form_item}
                  type="number"
                  min={1990}
                  aria-controls="calendar_main_out"
                  defaultValue={year}
                  onChange={(event) => {
                    const year = event.target.valueAsNumber;
                    if (Number.isNaN(year) || year < 1990) return;
                    router.push(
                      getCalUrl({
                        group,
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

          <div className={style.element_container}>
            {supportsMonthInput && !isFullYear && (
              <label className={style.label}>
                Gehe zum Monat
                <input
                  className={style.form_item}
                  type="month"
                  aria-controls="calendar_main_out"
                  min="1990-01"
                  value={`${year}-${String(month).padStart(2, "0")}`}
                  onChange={(event) => {
                    const value = event.target.valueAsDate;
                    if (value == null) return;

                    router.push(
                      getCalUrl({
                        group,
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

          <div className={style.element_container}>
            {supportsDateInput && (
              <label className={style.label}>
                Suche einen Tag
                <input
                  className={style.form_item}
                  type="date"
                  aria-controls="calendar_main_out"
                  min="1990-01-01"
                  defaultValue={searchValue}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value == null || value.length === 0) {
                      router.push(
                        getCalUrl({
                          search: null,
                          group,
                          shiftModel,
                          isFullYear,
                          month,
                          year,
                        }),
                      );
                    } else {
                      const date = event.target.valueAsDate || new Date(value);
                      router.push(
                        getCalUrl({
                          group,
                          shiftModel,
                          isFullYear: false,
                          year: date.getFullYear(),
                          month: date.getMonth() + 1,
                          search: date.getDate(),
                        }),
                      );
                    }
                  }}
                />
              </label>
            )}
          </div>

          <Link
            key={isFullYear}
            href={getCalUrl({
              group,
              shiftModel,
              isFullYear: !isFullYear,
              year,
              month,
            })}
            className={style.month_full_year_toggle}
            aria-controls="calendar_main_out"
            onClick={() => {
              setShowMenu(false);
            }}
          >
            Zeige {isFullYear ? "Monate" : "ganzes Jahr"}
          </Link>

          <label className={style.label}>
            Schichtmodell
            <select
              className={style.form_item}
              aria-controls="calendar_main_out"
              value={shiftModel}
              onChange={(event) => {
                router.push(
                  getCalUrl({
                    group: 0,
                    shiftModel: event.target.value,
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

          <select
            className={style.groups}
            aria-controls="calendar_main_out"
            aria-label="Schichtgruppen"
            value={group}
            onChange={(event) => {
              router.push(
                getCalUrl({
                  group: +event.target.value,
                  shiftModel,
                  isFullYear,
                  year,
                  month,
                }),
              );
            }}
          >
            <option value="0">Alle Gruppen</option>
            {groupOptions}
          </select>

          <button
            type="button"
            className={style.small_button}
            onClick={onShare}
            aria-label="Teile deine Schicht"
          >
            <Image
              src="/assets/icons/share21.svg"
              height="32"
              width="32"
              alt="teilen"
            />
          </button>
        </div>
      </div>
    </details>
  );
}
