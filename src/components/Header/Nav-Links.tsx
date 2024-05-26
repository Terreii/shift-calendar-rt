/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useMemo } from "preact/hooks";
import { addMonths } from "date-fns/addMonths";

import { useToday } from "../../../hooks/time";
import { useIsClient } from "../../../hooks/utils";
import { getCalUrl, getTodayUrl } from "../../../lib/utils";
import { type ShiftModelKeys } from "../../../config/shifts";

import style from "./style.module.css";

/**
 * Display 3 links to move in the calendar.
 * One button is move to today. And the other once are to move to the next/previous month/year.
 * @param param             Preact params.
 * @param param.year        Current active year.
 * @param param.month       Current active month.
 * @param param.isFullYear  Is the full year shown?
 * @param param.shiftModel  The current shift model.
 */
export default function HeaderNavLinks({
  year,
  month,
  isFullYear,
  shiftModel,
}: {
  year: number;
  month: number;
  isFullYear: boolean;
  shiftModel: ShiftModelKeys;
}) {
  const today = useToday();
  const isClient = useIsClient();

  const { lastMonth, nextMonth } = useMemo(() => {
    if (isFullYear) {
      return {
        lastMonth: getCalUrl({
          shiftModel,
          isFullYear: true,
          year: year - 1,
          month: 1,
        }),
        nextMonth: getCalUrl({
          shiftModel,
          isFullYear: true,
          year: year + 1,
          month: 1,
        }),
      };
    }

    const then = new Date(year, month - 1, 1, 0, 0, 0);

    return {
      lastMonth: getMonthUrl(then, -1, shiftModel),
      nextMonth: getMonthUrl(then, +1, shiftModel),
    };
  }, [year, month, isFullYear, shiftModel]);

  return (
    <>
      <a
        key={`previous_${year}_${month}`}
        href={lastMonth}
        class={style.navi_link}
        title={isFullYear ? "voriges Jahr" : "vorigen Monat"}
      >
        {"<"}
      </a>

      <a
        href={getTodayUrl({
          shiftModel,
          today: isClient ? today : undefined,
          group: 0,
        })}
        class={style.navi_link}
        title="zeige aktuellen Monat"
      >
        Heute
      </a>

      <a
        key={`next_${year}_${month}`}
        href={nextMonth}
        class={style.navi_link}
        title={isFullYear ? "nächstes Jahr" : "nächster Monat"}
      >
        {">"}
      </a>
    </>
  );
}

function getMonthUrl(time, change, shiftModel) {
  const month = addMonths(time, change);
  return getCalUrl({
    shiftModel,
    isFullYear: false,
    year: month.getFullYear(),
    month: month.getMonth() + 1,
  });
}
