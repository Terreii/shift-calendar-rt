/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ByMonths from "../../../../../../components/by-month";
import Downloader from "../../../../../../components/download";
import Legend from "../../../../../../components/legend";
import Revalidator from "../../../../../../components/revalidator";
import {
  shiftModelNames,
  shiftModelText,
  type ShiftModels,
} from "../../../../../../lib/constants";
import { parseNumber, getTodayZeroIndex } from "../../../../../../lib/utils";

import style from "../../../../../../styles/calendar.module.css";

export const revalidate = 5; // revalidate the data at most every 5 minutes

type Args = { shiftModel: ShiftModels; year: string; month: string };
type SearchParams = { group?: string; search?: string };

export async function generateMetadata({
  params: { shiftModel, year, month },
}: {
  params: Args;
}): Promise<Metadata> {
  return {
    title: `Monat ${year}-${month.padStart(2, "0")} | ${
      shiftModelText[shiftModel]
    }`,
  };
}

export default function MonthPage({
  params: { shiftModel, year: yearString, month: monthString },
  searchParams: { group: groupString, search: searchString },
}: {
  params: Args;
  searchParams: SearchParams;
}) {
  if (!shiftModelNames.includes(shiftModel)) {
    redirect("/");
  }
  const today = getTodayZeroIndex();
  const year = parseNumber(yearString, null);
  const monthQuery = parseNumber(monthString, null);
  const month = monthQuery ? monthQuery - 1 : monthQuery;
  const group = parseNumber(groupString, 0);
  const search = parseNumber(searchString, null);

  if (year == null) {
    return <h2>{yearString} is not a valid year.</h2>;
  }
  if (month == null || month < 0 || month > 11) {
    return <h2>{monthString} is not a valid month.</h2>;
  }

  return (
    <main className={style.main}>
      <Revalidator today={today} />

      <Legend shiftKey={shiftModel} />

      <ByMonths
        key={`${year}-${month}`}
        shiftModel={shiftModel}
        group={group}
        search={search}
        year={year}
        month={month}
        today={today}
      />

      <Downloader shiftModel={shiftModel} year={year} month={month + 1} />
    </main>
  );
}
