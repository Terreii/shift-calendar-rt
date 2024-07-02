/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import ms from "milliseconds";

import shiftModels, {
  type Cycle,
  type ShiftModel,
  type ShiftModelsWithFallbackKeys,
} from "./shifts.ts";
import { getDaysInMonth } from "./utils.js";

/**
 * Get the UTC Unix time in milliseconds.
 * @param   year  Year
 * @param   month Month with a zero index.
 * @param   day   Day in month
 */
function getTime(year: number, month: number, day: number): number {
  const monthStr = String(month + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  // use JSON string, because if UTC is used on some days it calculates the wrong shift.
  const date = new Date(`${year}-${monthStr}-${dayStr}T03:00:00.000Z`);
  const time = date.getTime() - ms.days(1);
  return time;
}

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
  const modelStartDate = new Date(config.startDate + "T03:00:00.000Z");
  const modelStartYear = modelStartDate.getUTCFullYear();
  const modelStartMonth = modelStartDate.getUTCMonth();
  if (
    year < modelStartYear ||
    (year === modelStartYear && month < modelStartMonth)
  ) {
    return getMonthData(year, month, config.fallback);
  }

  if (
    year === modelStartYear &&
    month === modelStartMonth &&
    modelStartDate.getUTCDate() > 1
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
  modelStartDate: Date,
  year: number,
  month: number,
): MonthWorkData {
  const fallbackConfig = shiftModels[config.fallback];
  const daysSinceFallbackModelStart = differenceInCalendarDays(
    getTime(year, month, 1),
    new Date(fallbackConfig.startDate + "T03:00:00.000Z"),
  );
  const groups = getGroupsConfig(config);
  const fallbackGroups = getGroupsConfig(fallbackConfig);

  const daysData: DayWorkdata[] = [];
  const workingCount: number[] = new Array(
    Math.max(groups.length, fallbackGroups.length),
  ).fill(0);

  const newModelStartDay = modelStartDate.getUTCDate() - 1;

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
    const dayInCycle =
      (daysSinceModelStart - offset + cycle.length) % cycle.length;
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
 * Get and clean up the groups config of a shift config.
 * @param config  The Config of the shift.
 * @returns       Groups Config.
 */
function getGroupsConfig(config: ShiftModel): AllGroupsConfig {
  return config.groups.map((data) =>
    typeof data === "number" ? { offset: data, cycle: config.cycle } : data,
  );
}
