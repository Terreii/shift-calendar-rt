/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { ShiftModels } from "../../lib/constants";

import { formatISO } from "date-fns/formatISO";
import Link from "next/link";

import style from "../../styles/calendar.module.css";

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
    <td className={style.day_in_month}>
      <Link
        href={`/cal/${shiftModel}/${time.getFullYear()}/${(time.getMonth() + 1)
          .toString()
          .padStart(2, "0")}?search=${time.getDate()}`}
        className={style.day_in_month__link}
      >
        <time dateTime={formatISO(time, { representation: "date" })}>
          {time.getDate()}
        </time>
      </Link>
    </td>
  );
}
