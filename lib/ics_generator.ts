/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { addDays, addMonths, addYears, subYears, startOfMonth } from "date-fns";

import shiftsConfig from "../config/shifts.ts";
import { type ShiftModels, shiftModelText } from "./constants.ts";
import { Workdata, getGroupMonthData } from "./workdata.ts";

/**
 * Generates an ics file of a shift group.
 *
 * All events from now - 1 year to now + 2 years are included.
 * @param model  Shift model key
 * @param group  Group to generate
 */
export default function* generate(model: ShiftModels, group: number) {
  yield metadata(model, group);

  const today = new Date();
  let date = subYears(today, 1);
  const end = startOfMonth(addYears(today, 2)).getTime();
  while (date.getTime() < end) {
    yield generateMonth(model, group, date.getFullYear(), date.getMonth());
    date = addMonths(date, 1);
  }

  yield "\nEND:VCALENDAR\n";
}

function generateMonth(
  model: ShiftModels,
  group: number,
  year: number,
  month: number,
): string {
  const shifts = getGroupMonthData(year, month, model, group).days;
  const creationDay = toTimestamp(
    subYears(new Date(year, month, 1, 0, 0, 0), 1),
  );

  let result = "";
  for (let i = 0, max = shifts.length; i < max; i++) {
    const day = i + 1;
    const shiftKey = shifts[i];
    if (shiftKey !== "K") {
      result += generateDay(
        model,
        shiftKey,
        group,
        creationDay,
        year,
        month,
        day,
      );
    }
  }

  return result;
}

function generateDay(
  model: ShiftModels,
  shiftKey: Workdata,
  group: number,
  creationDay: string,
  year: number,
  month: number,
  day: number,
): string {
  const config = shiftsConfig[model];
  const shift = config.shifts[shiftKey];
  const startDate = new Date(year, month, day, shift.start[0], shift.start[1]);
  const endDate = new Date(year, month, day, shift.end[0], shift.end[1]);
  if (shift.start[0] > shift.end[0]) {
    // shift goes to the next day
    endDate.setTime(addDays(endDate, 1).getTime());
  }
  return `
BEGIN:VEVENT
UID:SHIFT_${model}_GROUP_${group + 1}_${year}-${month + 1}-${day}
SUMMARY:${shift.name}
DTSTART;TZID=Europe/Berlin:${toTimestamp(startDate)}
DTEND;TZID=Europe/Berlin:${toTimestamp(endDate)}
DTSTAMP:${creationDay}
LOCATION:Tübingerstraße 123\\n72762 Reutlingen\\nDeutschland
GEO:48.495252;9.192696
END:VEVENT
`;
}

function metadata(model: ShiftModels, group: number): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
METHOD:PUBLISH
X-WR-CALNAME:${shiftModelText[model]} Gruppe ${group + 1}
CALSCALE:GREGORIAN
X-WR-TIMEZONE:Europe/Berlin
PRODID:schichtkalender.app

BEGIN:VTIMEZONE
TZID:Europe/Berlin
BEGIN:STANDARD
UID:EU_TIMEZONE_STANDARD
DTSTART:16011028T030000
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
END:STANDARD

BEGIN:DAYLIGHT
UID:EU_TIMEZONE_DAYLIGHT
DTSTART:16010325T020000
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
END:DAYLIGHT

END:VTIMEZONE
`;
}

/**
 * Generate a DateTime stamp.
 * @param time   Date to format
 * @returns Date-Time string with only numbers T and Z.
 */
export function toTimestamp(time: Date): string {
  const year = time.getFullYear();
  const month = toCharNum(time.getMonth() + 1);
  const day = toCharNum(time.getDate());
  const hours = toCharNum(time.getHours());
  const minutes = toCharNum(time.getMinutes());
  return year + month + day + "T" + hours + minutes + "00Z";
}
function toCharNum(num: number) {
  return String(num).padStart(2, "0");
}
