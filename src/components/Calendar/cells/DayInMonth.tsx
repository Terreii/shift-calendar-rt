/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { ShiftModels } from "../../../../lib/constants";

import { formatISO } from "date-fns/formatISO";

import { getCalUrl } from "../../../../lib/utils";

import style from "../style.module.css";

/**
 * Render the day in month cell.
 * @param  param              React arguments.
 * @param  param.time         Date object.
 * @param  param.shiftModel   Model name of the displayed shift.
 */
export default function DayInMonthCell({
  time,
  shiftModel,
}: {
  time: Date;
  shiftModel: ShiftModels;
}) {
  return (
    <td class={style.day_in_month}>
      <a
        href={getCalUrl({
          shiftModel,
          year: time.getFullYear(),
          month: time.getMonth() + 1,
          day: time.getDate(),
        })}
        class={style.day_in_month__link}
      >
        <time dateTime={formatISO(time, { representation: "date" })}>
          {time.getDate()}
        </time>
      </a>
    </td>
  );
}
