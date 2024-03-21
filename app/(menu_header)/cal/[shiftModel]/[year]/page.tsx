/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Container from "./monthsContainer.tsx";
import Month from "../../../../../components/month";
import Downloader from "../../../../../components/download";
import Legend from "../../../../../components/legend";
import {
  shiftModelNames,
  shiftModelText,
  type ShiftModels,
} from "../../../../../lib/constants";
import selectMonthData from "../../../../../lib/select-month-data";
import { parseNumber } from "../../../../../lib/utils";

import style from "../../../../../styles/calendar.module.css";

export const revalidate = 600; // revalidate the data at most every 10 minutes

type Args = { shiftModel: ShiftModels; year: string };
type SearchParams = { group?: string };

export async function generateMetadata({
  params: { shiftModel, year },
}: {
  params: Args;
}): Promise<Metadata> {
  return {
    title: `Jahr ${year} - ${shiftModelText[shiftModel]}
    }`,
  };
}

export default function Year({
  params: { shiftModel, year: yearString },
  searchParams: { group: groupString },
}: {
  params: Args;
  searchParams: SearchParams;
}) {
  if (!shiftModelNames.includes(shiftModel)) {
    redirect("/");
  }
  const year = parseNumber(yearString, null);
  const group = parseNumber(groupString ?? "0", 0) as number;

  if (year == null) {
    return <h2>{yearString} is not a valid year.</h2>;
  }

  const monthsData: [number, number][] = [];
  for (let i = 0; i < 12; i++) {
    monthsData.push([year, i]);
  }

  return (
    <main className={style.main}>
      <Legend shiftKey={shiftModel} year={year} month={0} />

      <Container>
        {monthsData.map(([year, month]) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            group={group}
            shouldTranistionToNewPosition={false}
            search={null}
          />
        ))}
      </Container>

      <Downloader shiftModel={shiftModel} year={year} />
    </main>
  );
}
