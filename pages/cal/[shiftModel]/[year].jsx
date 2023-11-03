/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Head from "next/head";
import { useRouter } from "next/router";
import differenceInSeconds from "date-fns/differenceInSeconds";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";

import Month from "../../../components/month";
import Downloader from "../../../components/download";
import Legend from "../../../components/legend";
import { useTodayZeroIndex, useUnloadedFix } from "../../../hooks/time";
import { useTitleAlert } from "../../../hooks/utils";
import { shiftModelText } from "../../../lib/constants";
import selectMonthData from "../../../lib/select-month-data";
import { parseNumber } from "../../../lib/utils";

import style from "../../../styles/calendar.module.css";

export default function Year() {
  const router = useRouter();
  const today = useTodayZeroIndex();
  const shiftModel = router.query.shiftModel;
  const year = parseNumber(router.query.year, null);
  const group = parseNumber(router.query.group, 0);
  const clickHandler = useTitleAlert();

  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
  }

  if (year == null) {
    return <h2>{router.query.year} is not a valid year.</h2>;
  }

  const monthsData = [];
  for (let i = 0; i < 12; i++) {
    monthsData.push([year, i]);
  }

  return (
    <main className={style.main}>
      <Head>
        <title>
          {`Jahr ${year} - ${shiftModelText[shiftModel]} - Schichtkalender für Bosch Reutlingen`}
        </title>
      </Head>

      <Legend shiftKey={shiftModel} />

      <div
        id="calendar_main_out"
        className={style.container}
        onClick={clickHandler}
        aria-live="polite"
      >
        {monthsData.map(([year, month]) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            today={today[0] === year && today[1] === month ? today : null}
            group={group}
          />
        ))}
      </div>

      <Downloader shiftModel={shiftModel} year={year} />
    </main>
  );
}

/**
 * Get the props for server side rendering.
 * @param {import('next').GetServerSidePropsContext} context Next SSR context.
 * @returns {import('next').GetServerSidePropsResult}
 */
export async function getServerSideProps(context) {
  const now = new Date();
  const cacheTill = roundToNearestMinutes(now, {
    nearestTo: 30,
    roundingMethod: "ceil",
  });
  const cacheSeconds = differenceInSeconds(cacheTill, now);
  context.res.setHeader("Cache-Control", "s-maxage=" + cacheSeconds);
  return {
    props: context.query,
  };
}
