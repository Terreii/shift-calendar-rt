/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { TZDate } from "@date-fns/tz";
import { useMemo } from "preact/hooks";
import { addMonths } from "date-fns/addMonths";

import { useToday } from "../../hooks/time";
import { useIsClient } from "../../hooks/utils";
import { getCalUrl, getTodayUrl } from "../../../lib/utils";
import { type ShiftModelKeys } from "../../../lib/shifts";

import leftArrow from "bootstrap-icons/icons/caret-left-fill.svg";
import rightArrow from "bootstrap-icons/icons/caret-right-fill.svg";

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

    const then = new TZDate(year, month - 1, 1, 0, 0, 0, "Europe/Berlin");

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
        class="inline-block px-4 py-3 text-white hover:bg-emerald-600 focus-visible:bg-emerald-600 focus-visible:ring-2 focus-visible:outline-hidden"
        title={isFullYear ? "voriges Jahr" : "vorigen Monat"}
      >
        <img src={leftArrow} height="22" width="22" alt="" class="invert" />
      </a>

      <a
        href={getTodayUrl({
          shiftModel,
          today: isClient ? today : undefined,
          group: 0,
        })}
        class="inline-block px-4 py-3 text-white hover:bg-emerald-600 focus-visible:bg-emerald-600 focus-visible:ring-2 focus-visible:outline-hidden"
        title="zeige aktuellen Monat"
      >
        Heute
      </a>

      <a
        key={`next_${year}_${month}`}
        href={nextMonth}
        class="inline-block px-4 py-3 text-white hover:bg-emerald-600 focus-visible:bg-emerald-600 focus-visible:ring-2 focus-visible:outline-hidden"
        title={isFullYear ? "nächstes Jahr" : "nächster Monat"}
      >
        <img src={rightArrow} height="22" width="22" alt="" class="invert" />
      </a>
    </>
  );
}

function getMonthUrl(time: Date, change: number, shiftModel: ShiftModelKeys) {
  const month = addMonths(time, change);
  return getCalUrl({
    shiftModel,
    isFullYear: false,
    year: month.getFullYear(),
    month: month.getMonth() + 1,
  });
}
