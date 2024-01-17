"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useParams, useSearchParams } from "next/navigation";

import { useToday } from "./time";

/**
 * Get the stored or current month.
 * @returns {{
 *   url: string,
 *   isFullYear: boolean,
 *   year: number,
 *   month: number,
 *   shiftModel: string,
 *   group: number,
 *   search: number | null
 * }}
 */
export function useQueryProps() {
  const { shiftModel, year: yearStr, month: monthStr } = useParams();
  const { group: groupStr = "0", search: searchStr } = useSearchParams();

  const today = useToday();
  const isFullYear = !monthStr && yearStr != null;
  const year = parseInt(yearStr) || today[0];
  const month = isFullYear ? 1 : parseInt(monthStr) || today[1];
  const group = parseInt(groupStr);
  const search =
    searchStr && !Number.isNaN(searchStr) ? parseInt(searchStr, 10) : null;

  return {
    isFullYear,
    year,
    month,
    shiftModel: shiftModel,
    group: Number.isNaN(group) ? 0 : group,
    search,
  };
}
