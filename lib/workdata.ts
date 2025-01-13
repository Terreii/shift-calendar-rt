/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { TZDate } from "@date-fns/tz";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import { formatISO } from "date-fns/formatISO";
import { parseISO } from "date-fns/parseISO";
import { addDays } from "date-fns/addDays";

import { shiftModelText } from "./constants.ts";
import shiftModels, {
  lastModified,
  type Shift,
  type Cycle,
  type ShiftModel,
  type ShiftModelKeys,
  type ShiftModelsWithFallbackKeys,
} from "./shifts.ts";
import { getDaysInMonth } from "./utils.js";

export type Workdata = "F" | "S" | "N" | "Normal" | "X" | "K";
type DayWorkdata = Workdata[];
export type MonthWorkData = {
  days: Workdata[][];
  workingCount: number[];
};

/**
 * Calculate when all groups will work in a month.
 *
 * This function switches between:
 *   - fullMonthAllGroupsShiftCalculation
 *   - modelSwitchingAllGroupsCalculation
 *   - Or selects a fallback shift model
 * @param year        Full Year of that month.
 * @param month       Month number.
 * @param shiftModel  Which shift model.
 * @returns  Working data of the group.
 */
export function getMonthData(
  year: number,
  month: number,
  shiftModel: ShiftModelsWithFallbackKeys,
): MonthWorkData {
  const config: ShiftModel = shiftModels[shiftModel];
  const modelStartDate = new TZDate(config.startDate, "Europe/Berlin");
  const modelStartYear = modelStartDate.getFullYear();
  const modelStartMonth = modelStartDate.getMonth();
  if (
    year < modelStartYear ||
    (year === modelStartYear && month < modelStartMonth)
  ) {
    return getMonthData(year, month, config.fallback);
  }

  if (
    year === modelStartYear &&
    month === modelStartMonth &&
    modelStartDate.getDate() > 1
  ) {
    // if all month is in new model use the new model.
    // This prevents empty group column if new model has fever groups.
    return modelSwitchingAllGroupsCalculation(
      config,
      modelStartDate,
      year,
      month,
    );
  }

  return fullMonthAllGroupsShiftCalculation(
    config,
    modelStartDate,
    year,
    month,
  );
}

type AllGroupsConfig = { offset: number; cycle: Cycle }[];

/**
 * Calculate when all groups will work in a month.
 * For when the full month is in one shift model.
 * @param config           The Configs of the Shift to calculate.
 * @param modelStartDate   StartDate of the shift model.
 * @param year             Year of the month to calculate.
 * @param month            Month (zero indexed) to calculate.
 * @returns                Working data of all groups.
 */
function fullMonthAllGroupsShiftCalculation(
  config: ShiftModel,
  modelStartDate: Date,
  year: number,
  month: number,
): MonthWorkData {
  const daysSinceModelStart = differenceInCalendarDays(
    new Date(year, month, 1),
    modelStartDate,
  );
  const groups = getGroupsConfig(config);

  const daysData: DayWorkdata[] = [];
  const workingCount = config.groups.map(() => 0);

  for (let i = 0, days = getDaysInMonth(year, month); i < days; i++) {
    const days = daysSinceModelStart + i;
    const shifts = calculateAllGroupsDay(groups, days, workingCount);
    daysData.push(shifts);
  }

  return {
    days: daysData,
    workingCount,
  };
}

/**
 * Calculate the shifts of all groups in a month where there is a switch in the model.
 * @param config           The Configs of the Shift to calculate.
 * @param modelStartDate   StartDate of the shift model.
 * @param year             Year of the month to calculate.
 * @param month            Month (zero indexed) to calculate.
 * @returns                Working data of all groups.
 */
function modelSwitchingAllGroupsCalculation(
  config: ShiftModel,
  modelStartDate: TZDate,
  year: number,
  month: number,
): MonthWorkData {
  const fallbackConfig = shiftModels[config.fallback];
  const daysSinceFallbackModelStart = differenceInCalendarDays(
    new TZDate(year, month, 1, "Europe/Berlin"),
    new TZDate(fallbackConfig.startDate, "Europe/Berlin"),
  );
  const groups = getGroupsConfig(config);
  const fallbackGroups = getGroupsConfig(fallbackConfig);

  const daysData: DayWorkdata[] = [];
  const workingCount: number[] = new Array(
    Math.max(groups.length, fallbackGroups.length),
  ).fill(0);

  const newModelStartDay = modelStartDate.getDate() - 1;

  for (let i = 0, days = getDaysInMonth(year, month); i < days; i++) {
    const [days, groupsConfig] =
      i < newModelStartDay
        ? [daysSinceFallbackModelStart + i, fallbackGroups]
        : [i - newModelStartDay, groups];
    const shifts = calculateAllGroupsDay(groupsConfig, days, workingCount);
    daysData.push(shifts);
  }

  return {
    days: daysData,
    workingCount,
  };
}

/**
 * Calculate the shifts for all groups on a day.
 * @param groups               Groups config.
 * @param daysSinceModelStart  Days since the model start date.
 * @param workingCount         Array of numbers for each group to count working days.
 *                             __Will be manipulated!__
 * @returns                    Shifts of that day for all groups.
 */
function calculateAllGroupsDay(
  groups: AllGroupsConfig,
  daysSinceModelStart: number,
  workingCount: number[],
): Workdata[] {
  return groups.map(({ offset, cycle }, group) => {
    const dayInCycle = calculateGroupDayInCycle(
      offset,
      cycle,
      daysSinceModelStart,
    );
    const shift = cycle[dayInCycle] as Workdata | null;
    if (shift == null) {
      return "K";
    }
    // Count how many days has been worked in that month
    workingCount[group]++;
    return shift;
  });
}

/**
 * Calculates the index in a groups cycle on a given day (since model start).
 * @param offset               Group offset in Cycle.
 * @param cycle                Group shift cycle.
 * @param daysSinceModelStart  Days since the model did start.
 * @returns Index in the cycle.
 */
function calculateGroupDayInCycle(
  offset: number,
  cycle: Cycle,
  daysSinceModelStart: number,
): number {
  return (daysSinceModelStart - offset + cycle.length) % cycle.length;
}

/**
 * Get and clean up the groups config of a shift config.
 * @param config  The Config of the shift.
 * @param group   Optional group number. If omitted returns all groups.
 * @returns       Groups Config.
 */
function getGroupsConfig(config: ShiftModel, group?: number): AllGroupsConfig {
  group = group == null ? group : Math.min(group, config.groups.length - 1);
  return config.groups
    .filter((_, index) => group == null || index === group)
    .map((data) =>
      typeof data === "number" ? { offset: data, cycle: config.cycle } : data,
    );
}

export type IcsShiftItem = {
  uid: `bosch-rt-${ShiftModelsWithFallbackKeys}-${string}-${number}-${number}@schichtkalender.app`;
  title: string;
  start: [number, number, number, number, number];
  duration: { hours: number; minutes: number };
  recurrenceRule:
    | `FREQ=DAILY;INTERVAL=${number}`
    | `FREQ=DAILY;INTERVAL=${number};UNTIL=${string}T000000Z`;
  sequence: number;
  lastModified: [number, number, number, number, number];
  calName: `Bosch Rt ${string}`;
};

/**
 * Generates a list of all items/events of a shift group for ics generators.
 * @param model  Shift model key.
 * @param group  Group of which the shifts to calculate.
 * @param year   Start year.
 */
export function getShiftsList(
  model: ShiftModelKeys,
  group: number,
  year: number,
): IcsShiftItem[] {
  const lastModifiedArray: [number, number, number, number, number] =
    year > lastModified[0] ? [year, 1, 1, 0, 0] : lastModified;

  return getAllShiftConfigs(model).flatMap(([modelKey, config], index, all) => {
    const seq = index + 1;
    const isLast = seq === all.length;
    const endDate = isLast
      ? new TZDate(year + 1000, 0, 1, 0, 0, 0, 0, "Europe/Berlin")
      : parseISO(all[index + 1][1].startDate);

    // only process models that are active in that year or later
    if (endDate.getFullYear() < year) return [];

    const sequence =
      year * 100 +
      (isLast ? 0 : 20) +
      (year > lastModified[0] ? 0 : lastModified[1]);
    const endDateString = formatISO(endDate, {
      format: "basic",
      representation: "date",
    });
    const daysSinceStart = Math.max(
      // start at beginning of year or the model start date.
      differenceInCalendarDays(
        new TZDate(year, 0, 1, 0, 0, 0, 0, "Europe/Berlin"),
        config.startDate,
      ),
      0, // if model starts in the year, daysSinceStart would be < 0.
      // Math.max ensures, that the events start at/after the model starts.
    );
    const [{ cycle, offset }] = getGroupsConfig(config, group);

    return cycle
      .map((item, itemIndex): IcsShiftItem | undefined => {
        if (item == null) return;

        const shift = config.shifts[item];
        return {
          uid: `bosch-rt-${modelKey}-${shift.name.toLowerCase()}-${index + 1}-${itemIndex + 1}@schichtkalender.app`,
          title: shift.name,
          start: firstShiftOccurrenceAfterDate(
            shift,
            itemIndex,
            config.startDate,
            daysSinceStart,
            cycle,
            offset,
          ),
          duration: shiftDuration(shift),
          recurrenceRule: isLast
            ? `FREQ=DAILY;INTERVAL=${cycle.length}`
            : `FREQ=DAILY;INTERVAL=${cycle.length};UNTIL=${endDateString}T000000Z`,
          sequence,
          lastModified: lastModifiedArray,
          calName: `Bosch Rt ${shiftModelText[model]}`,
        };
      })
      .filter((item) => item != null);
  });
}

function getAllShiftConfigs(
  modelKey: ShiftModelsWithFallbackKeys,
): [ShiftModelsWithFallbackKeys, ShiftModel][] {
  if (!(modelKey in shiftModels)) {
    throw new Error(`Unknown Shift model: ${modelKey}`);
  }
  const model = shiftModels[modelKey];
  if (model.fallback === modelKey) {
    return [[modelKey, model]];
  }
  const previousConfig = getAllShiftConfigs(model.fallback);
  previousConfig.push([modelKey, model]);
  return previousConfig;
}

/**
 * Calculates the first occurrence of a shift after a date.
 * @param shift                The shift config.
 * @param shiftIndex           Shift index in the Cycle.
 * @param modelStart           DateString (yyyy-mm-dd) of the model start.
 * @param daysSinceModelStart  Days since the model did start.
 * @param cycle                Groups shift cycle.
 * @param offset               Groups shift cycle offset.
 * @returns Date array usable in ics generation.
 */
function firstShiftOccurrenceAfterDate(
  shift: Shift,
  shiftIndex: number,
  modelStart: `${number}-${number}-${number}`,
  daysSinceModelStart: number,
  cycle: Cycle,
  offset: number,
): [number, number, number, number, number] {
  const dayInCycle = calculateGroupDayInCycle(
    offset,
    cycle,
    daysSinceModelStart,
  );
  const toAdd = (shiftIndex - dayInCycle + cycle.length) % cycle.length;
  const date = addDays(
    new TZDate(modelStart, "Europe/Berlin"),
    daysSinceModelStart + toAdd,
  );

  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    shift.start[0],
    shift.start[1],
  ];
}

function shiftDuration({
  start: [startHours, startMinues],
  end: [endHours, endMinutes],
}: Shift): {
  hours: number;
  minutes: number;
} {
  if (endHours <= startHours) {
    // shift goes into next day
    endHours += 24;
  }
  let hours = endHours - startHours;
  let minutes = endMinutes - startMinues;

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  return { hours, minutes };
}
