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
  hour = 25, // impossible hour, if no hour is passed to the function (today is not in current month)
  shiftModel: shiftModelKey,
}: {
  group: number;
  shift: Workdata;
  isToday: boolean;
  isYesterday: boolean;
  hour?: number;
  shiftModel: ShiftModelKeys;
}) {
  if (shift === "K") {
    return <td className={style.group} />;
  }
  const {
    start: [startHour],
    end: [endHour],
  } = getShift(shiftModelKey, shift);
  const isTodayShift =
    isToday &&
    ((hour >= startHour && hour < endHour) || // shift starts and ends today.
      (startHour >= endHour && hour > startHour)); // shift starts today and ends tomorrow.
  const isYesterdayShift =
    isYesterday && startHour >= endHour && hour < endHour;

  return (
    <td
      className={style.group}
      data-group={group + 1}
      data-current={isTodayShift || isYesterdayShift ? true : null}
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
