/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import formatISO from "date-fns/formatISO";

import style from "../../styles/calender.module.css";

/**
 * Render the day in month cell.
 * @param {object}   param                    React arguments.
 * @param {Date}     param.time               Date object.
 */
export default function DayInMonthCell({ time }) {
  return (
    <td className={style.day_in_month}>
      <time dateTime={formatISO(time, { representation: "date" })}>
        {time.getDate()}
      </time>
    </td>
  );
}
