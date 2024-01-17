/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ByMonths from "../../../../components/by-month";
import Downloader from "../../../../components/download";
import Legend from "../../../../components/legend";
import Revalidator from "../../../../components/revalidator";
import {
  shiftModelNames,
  shiftModelText,
  type ShiftModels,
} from "../../../../lib/constants";
import { parseNumber, getTodayZeroIndex } from "../../../../lib/utils";

import style from "../../../../styles/calendar.module.css";

export const revalidate = 5; // revalidate the data at most every 5 minutes

type Args = { shiftModel: ShiftModels };
type SearchParams = { group?: string };

export async function generateMetadata({
  params: { shiftModel },
}: {
  params: Args;
}): Promise<Metadata> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return {
    title: `Monat ${year}-${String(month + 1).padStart(2, "0")} | ${
      shiftModelText[shiftModel]
    }`,
  };
}

/**
 * Route that always displays today.
 */
export default function ShiftModel({
  params: { shiftModel },
  searchParams: { group: groupString },
}: {
  params: Args;
  searchParams: SearchParams;
}) {
  if (!shiftModelNames.includes(shiftModel)) {
    redirect("/");
  }
  const today = getTodayZeroIndex();
  const group = parseNumber(groupString ?? "0", 0);
  const year = today[0];
  const month = today[1];

  return (
    <main className={style.main}>
      <Revalidator today={today} />

      <Legend shiftKey={shiftModel} />

      <ByMonths
        key="today"
        shiftModel={shiftModel}
        group={group}
        search={null}
        year={year}
        month={month}
        today={today}
      />

      <Downloader shiftModel={shiftModel} year={year} month={month + 1} />
    </main>
  );
}
