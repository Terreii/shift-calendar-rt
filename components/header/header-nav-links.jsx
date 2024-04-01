/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useMemo } from "react";
import Link from "next/link";
import { addMonths } from "date-fns/addMonths";

import { useToday } from "../../hooks/time";
import { useIsClient } from "../../hooks/utils";
import { getCalUrl, getTodayUrl } from "../../lib/utils";

import style from "./header.module.css";

/**
 * Display 3 links to move in the calendar.
 * One button is move to today. And the other once are to move to the next/previous month/year.
 * @param {object}   param             Preact params.
 * @param {number}   param.year        Current active year.
 * @param {number}   param.month       Current active month.
 * @param {boolean}  param.isFullYear  Is the full year shown?
 * @param {string}   param.shiftModel  The current shift model.
 */
export default function HeaderNavLinks({
  year,
  month,
  isFullYear,
  shiftModel,
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
      <Link
        key={`previous_${year}_${month}`}
        href={lastMonth}
        className={style.navi_link}
        title={isFullYear ? "voriges Jahr" : "vorigen Monat"}
      >
        {"<"}
      </Link>

      <Link
        href={getTodayUrl({ shiftModel, today: isClient ? today : undefined })}
        className={style.navi_link}
        title="zeige aktuellen Monat"
      >
        Heute
      </Link>

      <Link
        key={`next_${year}_${month}`}
        href={nextMonth}
        className={style.navi_link}
        title={isFullYear ? "nächstes Jahr" : "nächster Monat"}
      >
        {">"}
      </Link>
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
