/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { addMonths } from "date-fns/addMonths";

import ByMonths from "../../../../../../components/by-month";
import Downloader from "../../../../../../components/download";
import Legend from "../../../../../../components/legend";
import {
  shiftModelNames,
  shiftModelText,
  type ShiftModels,
} from "../../../../../../lib/constants";
import { parseNumber } from "../../../../../../lib/utils";

import style from "../../../../../../styles/calendar.module.css";

type Args = { shiftModel: ShiftModels; year: string; month: string };

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
}: {
  params: Args;
}) {
  if (!shiftModelNames.includes(shiftModel)) {
    redirect("/");
  }
  const year = parseNumber(yearString, null);
  const monthQuery = parseNumber(monthString, null);
  const month = monthQuery ? monthQuery - 1 : monthQuery;

  if (year == null) {
    return <h2>{yearString} is not a valid year.</h2>;
  }
  if (month == null || month < 0 || month > 11) {
    return <h2>{monthString} is not a valid month.</h2>;
  }

  return (
    <main className={style.main}>
      <Legend shiftKey={shiftModel} year={year} month={month} />

      <ByMonths
        key={`${year}-${month}`}
        shiftModel={shiftModel}
        group={0}
        search={null}
        year={year}
        month={month}
      />

      <Downloader shiftModel={shiftModel} year={year} month={month + 1} />
    </main>
  );
}

export const revalidate = false;
