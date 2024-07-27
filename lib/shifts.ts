/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * A shift type. It is part of a shift model.
 *
 * It repesent a single shift type. Like morning shift.
 */
export type Shift = {
  /** Displayed (test) name of the shift */
  name: string;
  /** start time [hour, minutes] of that shift */
  start: [number, number];
  /** end time [hour, minutes] of that shift */
  end: [number, number];
};

/**
 * Key for a shift.
 * Is used to display a shift in /cal/[model] and excel exports.
 */
export type ShiftKey = string;

/**
 * Shift Cycle.
 *
 * It is a array of ShiftKey and null. Where null is a free shift (weekend).
 * Example Bosch 6-4 model:
 * ```json
 * ["F", "F", "S", "S", "N", "N", null, null, null, null]
 * ```
 */
export type Cycle = (ShiftKey | null)[];

/**
 * A single shift group.
 *
 * Can be a number, repesenting the start offset (Offset from Shiftmodel.startDate),
 * or an object with offset and own cycle.
 */
export type ShiftGroup =
  | number
  | {
      /**
       * Start offset from the ShiftModel.startDate.
       * In days.
       */
      offset: number;

      /**
       * If the shift group has a different cycle then the shift model. Else undefined.
       *
       * It is a array of ShiftKey and null. Where null is a free shift (weekend).
       * Example Bosch 6-4 model:
       * ```json
       * ["F", "F", "S", "S", "N", "N", null, null, null, null]
       * ```
       */
      cycle: Cycle;
    };

/**
 * A shift model. It is a collection of shifts.
 *
 * It contains all needed information to calculate all shifts.
 */
export type ShiftModel = {
  /** Displayed (text) name of the shift model */
  name: string;

  /**
   * Shift types
   *
   * The key is its short name. Used in the /cal/[model] routes.
   */
  shifts: Record<ShiftKey, Shift>;

  /**
   * Start date.
   *
   * When the shift model did start.
   * In ISO Date string.
   */
  startDate: `${number}-${number}-${number}`;

  /**
   * The standard cycle of a shift model.
   *
   * It is a array of ShiftKey and null. Where null is a free shift (weekend).
   * Example Bosch 6-4 model:
   * ```json
   * ["F", "F", "S", "S", "N", "N", null, null, null, null]
   * ```
   */
  cycle: Cycle;

  /**
   * Every group of a model.
   */
  groups: ShiftGroup[];

  /**
   * List of closing days.
   */
  closingDays: ClosingDay[];

  /**
   * Fallback calendar for before startDate
   */
  fallback: ShiftModelsWithFallbackKeys;
};

/**
 * Day where usually no shift works.
 *
 * Can be absolute or relative to a holiday.
 */
export type ClosingDay = {
  /**
   * Name of the day.
   */
  name: string;
} & (
  | {
      /**
       * Date (month, day) when the closing day is.
       *
       * Month is not zero indexed. January is 1.
       */
      date: [number, number];
    }
  | {
      /**
       * Days offset from `from`.
       */
      relative: number;

      /**
       * Name of changing holiday.
       *
       * Currently only easter is supported.
       * Ester is the easter sunday.
       */
      from: "easter";
    }
);

export const shift66Name = "6-6";
export const shift64Name = "6-4";
export const shiftWfW = "wfw";
export const shiftWfWOld = "wfw-old";
export const rotatingShift = "rotating";
export const shiftAddedNight = "added-night";
export const shiftAddedNight8 = "added-night-8";
export const weekend = "weekend";
export const shift44Name = "4-4";

export type ShiftModelKeys =
  | typeof shift66Name
  | typeof shift64Name
  | typeof shiftWfW
  | typeof rotatingShift
  | typeof shiftAddedNight
  | typeof shiftAddedNight8
  | typeof weekend;

export type ShiftModelsWithFallbackKeys =
  | ShiftModelKeys
  | typeof shift44Name
  | typeof shiftWfWOld;

const boschKontiShifts: Record<ShiftKey, Shift> = {
  F: {
    name: "Frühschicht",
    start: [6, 0],
    end: [14, 30],
  },
  S: {
    name: "Spätschicht",
    start: [14, 0],
    end: [22, 30],
  },
  N: {
    name: "Nachtschicht",
    start: [22, 0],
    end: [6, 30],
  },
};
const boschRotatingShifts: Record<ShiftKey, Shift> = {
  F: {
    name: "Frühschicht",
    start: [6, 15],
    end: [14, 0],
  },
  S: {
    name: "Spätschicht",
    start: [13, 45],
    end: [21, 45],
  },
  N: {
    name: "Nachtschicht",
    start: [21, 30],
    end: [6, 15],
  },
};

const boschClosingDays: ClosingDay[] = [
  { name: "Ostern", relative: -2, from: "easter" },
  { name: "Ostern", relative: -1, from: "easter" },
  { name: "Ostern", relative: 0, from: "easter" },
  { name: "Ostern", relative: 1, from: "easter" },
  { name: "Weihnachten", date: [12, 24] },
  { name: "Weihnachten", date: [12, 25] },
  { name: "Weihnachten", date: [12, 26] },
];

const shifts: Record<ShiftModelsWithFallbackKeys, ShiftModel> = {
  [shift66Name]: {
    name: "6 - 6 Kontischicht",
    shifts: boschKontiShifts,
    startDate: "2010-04-04",
    cycle: ["F", "F", "S", "S", "N", "N", null, null, null, null, null, null],
    groups: [4, -2, 6, 0, -4, 2],
    closingDays: boschClosingDays,
    fallback: "4-4",
  },
  [shift64Name]: {
    name: "6 - 4 Kontischicht",
    shifts: boschKontiShifts,
    startDate: "2019-01-01",
    cycle: ["F", "F", "S", "S", "N", "N", null, null, null, null],
    groups: [
      {
        offset: 0,
        cycle: ["S", "S", "N", "N", "N", "N", null, null, null, null],
      },
      {
        offset: 8,
        cycle: ["F", "F", "F", "F", "S", "S", null, null, null, null],
      },
      6,
      4,
      2,
    ],
    closingDays: boschClosingDays,
    fallback: shift64Name,
  },
  [shiftWfWOld]: {
    name: "Werkfeuerwehr Old",
    shifts: boschKontiShifts,
    startDate: "2010-04-04",
    cycle: ["F", "F", "S", "S", "N", "N", null, null, null, null, null, null],
    groups: [4, 6, 8, 10, 0, 2],
    closingDays: boschClosingDays,
    fallback: shift44Name,
  },
  [shiftWfW]: {
    name: "Werkfeuerwehr",
    shifts: {
      X: {
        name: "Schicht",
        start: [7, 0],
        end: [7, 0],
      },
    },
    startDate: "2024-04-01",
    cycle: ["X", null, null, null],
    groups: [0, 1, 2, 3],
    closingDays: [],
    fallback: "wfw-old",
  },
  [rotatingShift]: {
    name: "Wechselschicht",
    shifts: {
      F: boschRotatingShifts.F,
      S: boschRotatingShifts.S,
    },
    startDate: "1989-11-06",
    cycle: [
      ...new Array(5).fill("F"),
      null,
      null,
      ...new Array(5).fill("S"),
      null,
      null,
    ],
    groups: [0, 7],
    closingDays: boschClosingDays,
    fallback: rotatingShift,
  },
  [shiftAddedNight]: {
    name: "aufgesetzte Nachtarbeit",
    shifts: {
      N: boschRotatingShifts.N,
    },
    startDate: "2000-01-01",
    cycle: [
      "N",
      "N",
      "N",
      "N",
      null,
      "N",
      "N",
      "N",
      "N",
      null,
      null,
      null,
      "N",
      "N",
      null,
      null,
      "N",
      "N",
      null,
      null,
      null,
    ],
    groups: [3, 10, -4],
    closingDays: boschClosingDays,
    fallback: rotatingShift,
  },
  [shiftAddedNight8]: {
    name: "8 Wochen Nachtarbeit",
    shifts: boschRotatingShifts,
    startDate: "2000-01-03",
    cycle: [],
    groups: (() =>
      [0, 1, 2].map((group) => {
        // This is a shift model where they work 8 weeks in rotating shifts,
        // and 8 weeks with night shift.
        const cycle: ("F" | "S" | "N" | null)[] = [];
        for (let i = 0; i < 8; i++) {
          // 8 weeks of rotating (morning a week and evening the other week)
          // Group 0 is in the oposit shift to the others.
          const shift = (group === 0 ? i + 1 : i) % 2 === 0 ? "F" : "S";
          const shifts = new Array(6).fill(shift, 0, 5).fill(null, 5);
          cycle.push(...shifts);
          if (i < 7) {
            // only add sunday it it is not the last week.
            // Because sunday will be the first night shift for group 0
            cycle.push(null);
          }
        }
        // add days till first night shift:
        // group 0: 0 days (start at sunday)
        // group 1: 1 day
        // group 2: 2 days
        cycle.push(...new Array(group).fill(null));
        for (let i = 0; i < 8; i++) {
          // add night shifts. They are 4 nights with 3 days off.
          cycle.push(...new Array(4).fill("N"));
          cycle.push(null);
          cycle.push(null);
          if (i < 7) {
            cycle.push(null);
          }
        }
        // add days till first night shift (- 2 days from last night shift):
        // group 0: 4 - 2 = 2 days
        // group 1: 3 - 2 = 1 day
        // group 2: 4 - 2 = 0 days
        cycle.push(...new Array(2 - group).fill(null));
        return { offset: -35, cycle };
      }))(),
    closingDays: boschClosingDays,
    fallback: rotatingShift,
  },
  [weekend]: {
    name: "Wochenend-Modell RtP2",
    shifts: {
      Normal: {
        name: "Schicht",
        start: [7, 0],
        end: [15, 0],
      },
    },
    startDate: "1989-11-08",
    cycle: [
      "Normal",
      "Normal",
      null,
      "Normal",
      "Normal",
      "Normal",
      "Normal",
      null,
      "Normal",
      "Normal",
      "Normal",
      "Normal",
      null,
      null,
    ],
    groups: [-2, 5],
    closingDays: boschClosingDays,
    fallback: weekend,
  },
  [shift44Name]: {
    name: "4 - 4 Kontischicht",
    shifts: boschKontiShifts,
    startDate: "1989-11-08",
    cycle: ["F", null, "N", null, "S", null].flatMap((shift) => [
      shift,
      shift,
      shift,
      shift,
    ]),
    groups: [0, 4, 8, 12, 16, 20],
    closingDays: boschClosingDays,
    fallback: shift44Name, // There is no fallback! Min date is 1990-01-01
  },
};

export default shifts;
