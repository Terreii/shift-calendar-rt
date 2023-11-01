/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import differenceInDays from "date-fns/differenceInDays/index.js";
import ms from "milliseconds";

import {
  type ShiftModels,
  rotatingShift,
  shiftAddedNight,
  shiftAddedNight8,
  weekend,
} from "./constants.ts";
import shiftModels, {
  type Cycle,
  type ShiftModel,
  type ShiftModelsWithFallbackKeys,
} from "../config/shifts.ts";
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

export type Workdata = "F" | "S" | "N" | "Normal" | "K";
type DayWorkdata = Workdata[];
export type MonthWorkData = {
  days: Workdata[][];
  workingCount: number[];
};

/**
 * Calculate when groups will work.
 * @param    year Full Year of that month
 * @param    month Month number
 * @param    shiftModel Which shift-model is it.
 * @returns  Working data of a group.
 */
export function getMonthData(
  year: number,
  month: number,
  shiftModel: ShiftModels,
): MonthWorkData {
  switch (shiftModel) {
    case shiftAddedNight:
      return getAddedNightModel(year, month);

    case shiftAddedNight8:
      return getAddedNight8Model(year, month);

    case rotatingShift:
      return getRotatingShift(year, month);

    case weekend:
      return getRtP2WeekendShift(year, month);

    default:
      return getAllGroupsMonthData(year, month, shiftModel);
  }
}

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
function getAllGroupsMonthData(
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
    return getAllGroupsMonthData(year, month, config.fallback);
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
  const daysSinceModelStart =
    differenceInDays(new Date(year, month, 1), modelStartDate) + 1;
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
  const daysSinceFallbackModelStart =
    differenceInDays(
      getTime(year, month, 1),
      new Date(fallbackConfig.startDate + "T03:00:00.000Z"),
    ) + 1;
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

/**
 * Get the working data of the rotating shift model.
 * @param    year Full Year of that month
 * @param    month Month number
 * @returns  Working data of the groups
 */
function getRotatingShift(year: number, month: number): MonthWorkData {
  const workingCount = [0, 0];
  const shifts: DayWorkdata[] = [];

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const time = getTime(year, month, i + 1) + ms.days(1);
    const weekDay = new Date(time).getUTCDay();
    const isWeekend = weekDay === 0 || weekDay === 6;

    if (isWeekend) {
      shifts.push(["K", "K"]);
    } else {
      workingCount[0]++;
      workingCount[1]++;

      const week = Math.floor((time + ms.days(3)) / ms.weeks(1)) % 2;
      shifts.push([week === 0 ? "F" : "S", week === 1 ? "F" : "S"]);
    }
  }

  return {
    days: shifts,
    workingCount,
  };
}

/**
 * Get the working data of the RtP2 Weekend model.
 * @param    year Full Year of that month
 * @param    month Month number
 * @returns  Working data of the groups
 */
function getRtP2WeekendShift(year: number, month: number): MonthWorkData {
  const groupsWorkingDays = [0, 0];
  const daysData: DayWorkdata[] = [];

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = getRtP2WeekendShiftDay(year, month, i + 1);

    daysData.push(aDay);

    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays,
  };
}

/**
 * Calculates the data of a day for the RtP2 Weekend model.
 * It is NN-K-NNNN-K-NNNN-KK
 * @param    year Full Year
 * @param    month Number of the month in the year
 * @param    day Day in the month
 * @returns  Working data of all groups on this day
 */
function getRtP2WeekendShiftDay(
  year: number,
  month: number,
  day: number,
): ("Normal" | "K")[] {
  const time = getTime(year, month, day);
  const cycleLength = 14;

  // get days count since 1.1.1970
  const daysInCycle = Math.floor(time / 1000 / 60 / 60 / 24) % cycleLength;

  return [4, 11].map((offset) => {
    let shiftDay = daysInCycle + offset;

    if (shiftDay >= cycleLength) {
      shiftDay -= cycleLength;
    }

    switch (shiftDay) {
      case 2:
      case 7:
      case 12:
      case 13:
        return "K";
      default:
        return "Normal";
    }
  });
}

/**
 * Get the working data of the added night-shift-model.
 * @param    year Full Year of that month
 * @param    month Month number
 * @returns  Working data of the groups
 */
function getAddedNightModel(year: number, month: number): MonthWorkData {
  const daysData: DayWorkdata[] = [];
  const groupsWorkingDays = [0, 0, 0];

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = getAddedNightModelDay(year, month, i + 1);

    daysData.push(aDay);

    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays,
  };
}

/**
 * Calculates the data of a day for the added night-shift-model.
 * It is NNNN-K-NNNN-KKK-NN-KK-NN-KKK.
 * @param    year Full Year
 * @param    month Number of the month in the year
 * @param    day Day in the month
 * @returns  Working data of all groups on this day
 */
function getAddedNightModelDay(
  year: number,
  month: number,
  day: number,
): DayWorkdata {
  const time = getTime(year, month, day);

  // get days count since 1.1.1970
  const daysInCycle = Math.floor(time / 1000 / 60 / 60 / 24) % 21;

  // Offset is for every group. When does the shift-cycle start?
  return [3, 17, 10].map((offset) => {
    let shiftDay = daysInCycle + offset;

    if (shiftDay > 20) {
      shiftDay -= 21;
    }

    switch (shiftDay) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 5: // free
      case 6:
      case 7:
      case 8:
      case 12: // 3 free
      case 13:
      case 16: // 2 free
      case 17:
        return "N"; // Nacht/Night 22 -  6:30
      default:
        return "K"; // No shift/free
    }
  });
}

/**
 * Get the working data of the added night-shift-model where they work for 8 week switch and
 * 8 weeks night.
 * @param    year Full Year of that month
 * @param    month Month number
 * @returns  Working data of the groups
 */
function getAddedNight8Model(year: number, month: number): MonthWorkData {
  const daysData: DayWorkdata[] = [];
  const groupsWorkingDays = [0, 0, 0];

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = getAddedNight8ModelDay(year, month, i + 1);

    daysData.push(aDay);

    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays,
  };
}

/**
 * Calculates the data of a day for the added night-shift-8-model.
 * It is 8 weeks F or S switch for one week. Then 8 weeks 4 nights a week.
 * @param    year Full Year
 * @param    month Number of the month in the year
 * @param    day Day in the month
 * @returns  Working data of all groups on this day
 */
function getAddedNight8ModelDay(
  year: number,
  month: number,
  day: number,
): DayWorkdata {
  const time = getTime(year, month, day) + ms.days(1);
  const weekDay = new Date(time).getDay();

  // get days count since 1.1.1970
  // 8 weeks switching, 8 weeks night
  const weeksInCycle = Math.floor((time / 1000 / 60 / 60 / 24 + 54) / 7) % 16;

  // Offset for every group. When does the night shift start?
  // It is also the group
  return [0, 1, 2].map((gr) => {
    // Type of work week
    switch (weeksInCycle) {
      case 0:
      case 2:
      case 4:
      case 6:
        if (weekDay === 0 || weekDay === 6) {
          return "K";
        } else {
          return gr === 0 ? "S" : "F";
        }

      case 1:
      case 3:
      case 5:
      case 7:
        if (weekDay === 0 || weekDay === 6) {
          return "K";
        } else {
          return gr === 0 ? "F" : "S";
        }

      default: {
        // night shift
        // when does the night shift start?
        const shiftDay = weekDay - gr;

        return shiftDay < 4 && shiftDay >= 0 ? "N" : "K";
      }
    }
  });
}
