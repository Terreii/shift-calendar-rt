/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from "../../styles/calender.module.css";

const longFormat = new Intl.DateTimeFormat("de-DE", { weekday: "long" });
const shortFormat = new Intl.DateTimeFormat("de-DE", { weekday: "short" });

/**
 * Render the cell with the week day.
 * @param {object}  param         React arguments.
 * @param {Date}    param.time    Date object.
 */
export default function WeekDayCell({ time }) {
  return (
    <td className={style.week_day}>
      <span className="sr-only">{longFormat.format(time)}</span>
      <span aria-hidden="true">{shortFormat.format(time)}</span>
    </td>
  );
}
