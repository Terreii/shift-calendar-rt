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
 * @param {object}  param                    React arguments.
 * @param {Date}    param.time               Date object.
 * @param {object}  [param.holidayData]      Holiday data of that day.
 * @param {object}  [param.dayLightSaving]   Data about the daylight saving switch.
 */
export default function WeekDayCell({ time, holidayData, dayLightSaving }) {
  // is on this day the switch from or to day-light-saving.
  const isDayLightSaving =
    dayLightSaving != null && dayLightSaving.day === time.getDate();

  let title;
  if (isDayLightSaving) {
    title = dayLightSaving.name;
  } else if (holidayData != null) {
    title = holidayData.name;
  }

  return (
    <td
      className={style.week_day}
      title={title}
      data-holiday={holidayData?.type}
      data-daylight={isDayLightSaving ? true : null}
    >
      <span className="sr-only">{longFormat.format(time)}</span>
      <span aria-hidden="true">{shortFormat.format(time)}</span>
    </td>
  );
}
