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
import Revalidator from "./revalidator";
import {
  shiftModelNames,
  shiftModelText,
  type ShiftModels,
} from "../../../../lib/constants";
import { getTodayZeroIndex } from "../../../../lib/utils";

import style from "../../../../styles/calendar.module.css";

export const revalidate = 600; // revalidate the data at most every 10 minutes

type Args = { shiftModel: ShiftModels };

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
}: {
  params: Args;
}) {
  if (!shiftModelNames.includes(shiftModel)) {
    redirect("/");
  }
  const [year, month] = getTodayZeroIndex();

  return (
    <main className={style.main}>
      <Revalidator year={year} month={month} />

      <Legend shiftKey={shiftModel} year={year} month={month} />

      <ByMonths
        key="today"
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
