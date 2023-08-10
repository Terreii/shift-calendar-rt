/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

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

export const shiftTitle = {
  F: "Frühschicht\r\n6 - 14:30 Uhr",
  S: "Spätschicht\r\n14 - 22:30 Uhr",
  N: "Nachtschicht\r\n22 - 6:30 Uhr (in den nächsten Tag)",
  K: null,
};

export const shift66Name = "6-6";
export const shift64Name = "6-4";
export const shiftWfW = "wfw";
export const rotatingShift = "rotating";
export const shiftAddedNight = "added-night";
export const shiftAddedNight8 = "added-night-8";
export const weekend = "weekend";

export type ShiftModels =
  | typeof shift66Name
  | typeof shift64Name
  | typeof shiftWfW
  | typeof rotatingShift
  | typeof shiftAddedNight
  | typeof shiftAddedNight8
  | typeof weekend;

export const shiftModelNames: ShiftModels[] = [
  shift66Name,
  shift64Name,
  shiftWfW,
  rotatingShift,
  shiftAddedNight,
  shiftAddedNight8,
  weekend,
];

export const shiftModelText: Record<ShiftModels, string> = {
  [shift66Name]: "6 - 6 Kontischicht",
  [shift64Name]: "6 - 4 Kontischicht",
  [shiftWfW]: "Werkfeuerwehr",
  [rotatingShift]: "Wechselschicht",
  [shiftAddedNight]: "aufgesetzte Nachtarbeit",
  [shiftAddedNight8]: "8 Wochen Nachtarbeit",
  [weekend]: "Wochenend-Modell RtP2",
};

export const shiftModelNumberOfGroups: Record<ShiftModels, number> = {
  [shift66Name]: 6,
  [shift64Name]: 5,
  [shiftWfW]: 6,
  [rotatingShift]: 2,
  [shiftAddedNight]: 3,
  [shiftAddedNight8]: 3,
  [weekend]: 2,
};
export const maxGroupCount = Math.max(
  ...Object.values(shiftModelNumberOfGroups),
);

export const workingLongName = {
  F: "Frühschicht",
  S: "Spätschicht",
  N: "Nachtschicht",
};

export const workingDescriptionId = Object.fromEntries(
  Object.entries(workingLongName).map(([key, value]) => [
    key,
    value + "_description",
  ]),
);

export function excelExportName(year: number, month: number): string {
  return `Shift_Export_${year}-${month.toString().padStart(2, "0")}.xlsx`;
}
export function excelExportModelFullYearName(
  model: ShiftModels,
  year: number,
): string {
  return `Shifts_Export_${year}_${model}.xlsx`;
}
