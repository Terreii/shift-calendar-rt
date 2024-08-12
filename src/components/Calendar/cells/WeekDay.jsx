/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import classNames from "classnames";

const longFormat = new Intl.DateTimeFormat("de-DE", { weekday: "long" });
const shortFormat = new Intl.DateTimeFormat("de-DE", { weekday: "short" });

/**
 * Render the cell with the week day.
 * @param {object}  param                    React arguments.
 * @param {Date}    param.time               Date object.
 * @param {object}  [param.holidayData]      Holiday data of that day.
 * @param {object}  [param.dayLightSaving]   Data about the daylight saving switch.
 * @param {"search"|"today"} [active]        Is this row today or a search result.
 */
export default function WeekDayCell({
  time,
  holidayData,
  dayLightSaving,
  active,
}) {
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
      class={classNames("border-b border-l-0 border-r border-t-0 p-1", {
        "border-b-4 border-t-4": active != null,
        "border-b-violet-400 border-t-violet-400": active === "search",
        "border-black": !isDayLightSaving && active !== "search",
        "border-b-4 border-l-4 border-r-4 border-t-4 border-red-600 bg-amber-300 text-black":
          isDayLightSaving,
        "cursor-help": holidayData?.type || isDayLightSaving,
        "bg-teal-400 text-black":
          !isDayLightSaving &&
          (holidayData?.type === "holiday" || holidayData?.type === "school"),
        "bg-cyan-500 text-black": holidayData?.type === "ramadan",
      })}
      title={title}
    >
      <span class="sr-only">{longFormat.format(time)}</span>
      <span aria-hidden="true">{shortFormat.format(time)}</span>
    </td>
  );
}
