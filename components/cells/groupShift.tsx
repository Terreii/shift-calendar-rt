"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import shiftModels, {
  type Shift,
  type ShiftModelKeys,
  type ShiftModelsWithFallbackKeys,
} from "../../config/shifts";
import { Workdata } from "../../lib/workdata";
import style from "../../styles/calendar.module.css";

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
}: {
  group: number;
  shift: Workdata;
  isToday: boolean;
  isYesterday: boolean;
  hour: number;
  minues: number;
  shiftModel: ShiftModelKeys;
}) {
  if (shift === "K") {
    return <td className={style.group} />;
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
      className={style.group}
      data-group={group + 1}
      data-current={isTodayShift || isYesterdayShift ? true : undefined}
      title={isTodayShift || isYesterdayShift ? "Aktuelle Schicht" : undefined}
      aria-describedby={shift + "_description"}
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
