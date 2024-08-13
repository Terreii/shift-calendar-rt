/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ShiftModelKeys } from "../../../../lib/shifts";

import classNames from "classnames";
import { formatISO } from "date-fns/formatISO";

import { getCalUrl } from "../../../../lib/utils";

/**
 * Render the day in month cell.
 * @param  param              React arguments.
 * @param  param.time         Date object.
 * @param  param.shiftModel   Model name of the displayed shift.
 */
export default function DayInMonthCell({
  time,
  shiftModel,
  active,
}: {
  time: Date;
  shiftModel: ShiftModelKeys;
  active?: "search" | "today";
}) {
  return (
    <td
      class={classNames("border-b border-r p-0", {
        "border-b-4 border-l-4 border-t-4": active != null,
        "border-y-violet-400 border-l-violet-400": active === "search",
        "border-l-0 border-t-0": active == null,
        "border-black": active !== "search",
      })}
    >
      <a
        href={getCalUrl({
          shiftModel,
          year: time.getFullYear(),
          month: time.getMonth() + 1,
          day: time.getDate(),
        })}
        class="inline-block h-full w-full p-1 text-inherit underline"
      >
        <time dateTime={formatISO(time, { representation: "date" })}>
          {time.getDate()}
        </time>
      </a>
    </td>
  );
}
