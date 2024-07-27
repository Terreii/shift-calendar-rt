/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { differenceInDays } from "date-fns/differenceInDays";
import { endOfISOWeek } from "date-fns/endOfISOWeek";
import { getDaysInMonth } from "date-fns/getDaysInMonth";
import { getISOWeek } from "date-fns/getISOWeek";

import style from "../style.module.css";

/**
 * Render the weekday.
 * @param {object}   param        React arguments.
 * @param {Date}     param.time   Date object.
 */
export default function WeekCell({ time }) {
  return (
    <td
      class={style.week_cell}
      rowSpan={
        Math.min(
          differenceInDays(endOfISOWeek(time), time),
          getDaysInMonth(time) - time.getDate(),
        ) + 1
      }
    >
      <span class={style.week_number}>{getISOWeek(time)}</span>
    </td>
  );
}
