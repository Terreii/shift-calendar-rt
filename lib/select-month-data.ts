/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { createCachedSelector } from "re-reselect";

import type { ShiftModels } from "./constants";
import getMonthData, { type MonthWorkData } from "./workdata.ts";
import getHolidayData from "./holiday-data.js";

export type MonthData = MonthWorkData & {
  holidays: Record<
    number,
    { name: string; type: "school" | "closing" | "holiday" | "ramadan" }
  >;
};

/**
 * CachedSelector that stores the month data.
 */
export default createCachedSelector(
  (year: number) => year,
  (_year: number, month: number) => month,
  (_year, _month, shiftModel: ShiftModels) => shiftModel,

  (year, month, shiftModel): MonthData => ({
    ...getMonthData(year, month, shiftModel),

    holidays: getHolidayData(year, month),
  }),
)(
  // Key selector. Data will be saved with this key.
  (year, month, shiftModel) => `${year}-${month}-${shiftModel}`,
);
