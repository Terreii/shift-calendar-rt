"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useToday } from "./time";
import { type ShiftModels } from "../lib/constants";

export type Result = {
  isFullYear: boolean;
  year: number;
  month: number;
  shiftModel: ShiftModels;
  search: number | null;
};

type Params = { shiftModel: string; year?: string; month?: string };

/**
 * Get the stored or current month.
 */
export function useQueryProps(): Result {
  const { shiftModel, year: yearStr, month: monthStr } = useParams<Params>();

  const today = useToday();
  const isFullYear = !monthStr && yearStr != null;
  const year =
    yearStr && !Number.isNaN(yearStr) ? parseInt(yearStr, 10) : today[0];
  const month = isFullYear
    ? 1
    : monthStr && !Number.isNaN(yearStr)
      ? parseInt(monthStr, 10)
      : today[1];
  const search = useSearchHash();

  return {
    isFullYear,
    year,
    month,
    shiftModel: shiftModel as ShiftModels,
    search,
  };
}

function useSearchHash(): number | null {
  const [search, setSearch] = useState<number | null>(null);
  const params = useParams();

  useEffect(() => {
    const reg = /day_\d{4}-\d{1,2}-(\d{1,2})/;
    const handler = () => {
      const hash = window.location.hash;
      if (hash.length <= 1) {
        setSearch(null);
        return;
      }
      const result = hash.match(reg);
      if ((result?.length ?? 0) >= 2) {
        setSearch(parseInt(result![1], 10));
      } else {
        setSearch(null);
      }
    };

    handler();
    window.addEventListener("hashchange", handler);
    return () => {
      window.removeEventListener("hashchange", handler);
    };
  }, [params]);

  return search;
}
