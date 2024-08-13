/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import classNames from "classnames";
import shiftModels, {
  type Shift,
  type ShiftModelKeys,
  type ShiftModelsWithFallbackKeys,
} from "../../../../lib/shifts";
import { Workdata } from "../../../../lib/workdata";

/**
 * Render a cell that displays if that shift group is working and what shift.
 * @param param          React arguments.
 * @param param.group    Number of group. Group 1 is 0.
 * @param param.shift    Shift data.
 */
export default function GroupShiftCell({
  group,
  shift,
  isToday,
  isYesterday,
  hour,
  minues,
  shiftModel: shiftModelKey,
  active,
}: {
  group: number;
  shift: Workdata;
  isToday: boolean;
  isYesterday: boolean;
  hour: number;
  minues: number;
  shiftModel: ShiftModelKeys;
  active?: "search" | "today";
}) {
  if (shift === "K") {
    return (
      <td
        class={classNames(
          "border-b border-l-0 border-r border-t-0 py-1 text-black",
          {
            "border-b-4 border-t-4 last:border-r-4": active != null,
            "border-b-violet-400 border-t-violet-400 last:border-r-violet-400":
              active === "search",
            "border-black": active !== "search",
          },
        )}
      />
    );
  }

  const {
    start: [startHour, startMinues],
    end: [endHour, endMinues],
  } = getShift(shiftModelKey, shift);

  const shiftSpansTwoDays = startHour >= endHour;
  const isTodayShift =
    isToday &&
    ((hour > startHour && hour < endHour) || // shift starts and ends today.
      (hour === startHour && minues >= startMinues) || // start hour.
      (!shiftSpansTwoDays && hour === endHour && minues < endMinues) || // End hour
      (shiftSpansTwoDays && // shift starts today and ends tomorrow.
        (hour > startHour || (hour === startHour && minues >= startMinues))));
  const isYesterdayShift =
    isYesterday &&
    shiftSpansTwoDays &&
    (hour < endHour || (hour === endHour && minues < endMinues));

  return (
    <td
      class={classNames(
        "border-b border-l-0 border-r border-t-0 py-1 text-black",
        {
          "border-b-4 border-l-4 border-r-4 border-t-4 font-bold underline":
            isTodayShift || isYesterdayShift,
          "border-b-4 border-t-4 last:border-r-4": active != null,
          "border-b-violet-400 border-t-violet-400 last:border-r-violet-400":
            active === "search",
          "border-black": active !== "search",
          "bg-[#ff69b4]": group === 0, // Group 1
          "bg-[#ff0]": group === 1, // Group 2
          "bg-[#f00]": group === 2, // Group 3
          "bg-[#0f0]": group === 3, // Group 4
          "bg-[#1e90ff]": group === 4, // Group 5
          "bg-[#cd853f]": group === 5, // Group 6
        },
      )}
      title={isTodayShift || isYesterdayShift ? "Aktuelle Schicht" : undefined}
      aria-describedby={`${shift}_description`}
    >
      {shift}
    </td>
  );
}

function getShift(
  modelKey: ShiftModelsWithFallbackKeys,
  shiftKey: Workdata,
): Shift {
  const shift = shiftModels[modelKey];
  if (shiftKey in shift.shifts) return shift.shifts[shiftKey];
  return getShift(shift.fallback, shiftKey);
}
