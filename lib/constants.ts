/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import shifts, {
  type ShiftModelKeys,
  shift44Name,
  shiftWfWOld,
} from "../config/shifts.ts";
export {
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftWfWOld,
  rotatingShift,
  shiftAddedNight,
  shiftAddedNight8,
  weekend,
  type ShiftModelKeys as ShiftModels,
} from "../config/shifts.ts";

export const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export const shiftModelNames = Object.keys(shifts).filter(
  (key) => key !== shift44Name && key !== shiftWfWOld,
) as ShiftModelKeys[];

export const shiftModelText = Object.fromEntries(
  Object.entries(shifts).map(([key, data]): [ShiftModelKeys, string] => [
    key as ShiftModelKeys,
    data.name,
  ]),
) as Record<ShiftModelKeys, string>;

export const shiftModelNumberOfGroups = Object.fromEntries(
  Object.entries(shifts).map(([key, data]) => [key, data.groups.length]),
) as Record<ShiftModelKeys, number>;
export const maxGroupCount = Math.max(
  ...Object.values(shiftModelNumberOfGroups),
);

export function excelExportName(year: number, month: number): string {
  return `Shift_Export_${year}-${month.toString().padStart(2, "0")}.xlsx`;
}
export function excelExportModelFullYearName(
  model: ShiftModelKeys,
  year: number,
): string {
  return `Shifts_Export_${year}_${model}.xlsx`;
}
