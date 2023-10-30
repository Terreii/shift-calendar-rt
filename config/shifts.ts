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
  shift: Record<ShiftKey, Shift>;

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
export const rotatingShift = "rotating";
export const shiftAddedNight = "added-night";
export const shiftAddedNight8 = "added-night-8";
export const weekend = "weekend";

export type ShiftModelKeys =
  | typeof shift66Name
  | typeof shift64Name
  | typeof shiftWfW
  | typeof rotatingShift
  | typeof shiftAddedNight
  | typeof shiftAddedNight8
  | typeof weekend;

const shifts: Record<typeof shift66Name, ShiftModel> = {
  [shift66Name]: {
    name: "6 - 6 Kontischicht",
    shift: {
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
    },
    startDate: "2010-04-04",
    cycle: ["F", "F", "S", "S", "N", "N", null, null, null, null, null, null],
    groups: [4, -2, 6, 0, -4, 2],
    closingDays: [
      { name: "Ostern", relative: -2, from: "easter" },
      { name: "Ostern", relative: -1, from: "easter" },
      { name: "Ostern", relative: 0, from: "easter" },
      { name: "Ostern", relative: 1, from: "easter" },
      { name: "Weihnachten", date: [12, 24] },
      { name: "Weihnachten", date: [12, 25] },
      { name: "Weihnachten", date: [12, 26] },
    ],
  },
};

export default shifts;