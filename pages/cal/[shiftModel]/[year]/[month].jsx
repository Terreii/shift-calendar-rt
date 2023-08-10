/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Head from "next/head";
import { useRouter } from "next/router";
import { DateTime, Info } from "luxon";

import ByMonths from "../../../../components/by-month";
import Downloader from "../../../../components/download";
import Legend from "../../../../components/legend";
import { useTodayZeroIndex, useUnloadedFix } from "../../../../hooks/time";
import { shiftModelText } from "../../../../lib/constants";
import { parseNumber } from "../../../../lib/utils";

import style from "../../../../styles/calender.module.css";

export default function MonthPage() {
  const router = useRouter();
  const today = useTodayZeroIndex();
  const shiftModel = router.query.shiftModel;
  const year = parseNumber(router.query.year, null);
  const monthQuery = parseNumber(router.query.month, null);
  const month = monthQuery ? monthQuery - 1 : monthQuery;
  const group = parseNumber(router.query.group, 0);
  const search = parseNumber(router.query.search, null);

  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
  }

  if (year == null) {
    return <h2>{router.query.year} is not a valid year.</h2>;
  }
  if (month == null || month < 0 || month > 11) {
    return <h2>{router.query.month} is not a valid month.</h2>;
  }

  return (
    <main className={style.main}>
      <Head>
        <title>
          {`Monat ${year}-${String(month + 1).padStart(2, "0")} - ${
            shiftModelText[shiftModel]
          } - Schichtkalender für Bosch Reutlingen`}
        </title>
      </Head>

      <Legend />

      <ByMonths
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

/**
 * Get the props for server side rendering.
 * @param {import('next').GetServerSidePropsContext} context Next SSR context.
 * @returns {import('next').GetServerSidePropsResult}
 */
export async function getServerSideProps(context) {
  const { year, month } = context.query;

  const date = DateTime.fromObject({
    year: parseInt(year),
    month: parseInt(month, 10),
    zone: "Europe/Berlin",
  });

  let maxAge = 60;

  const monthsDiff = date.diffNow("months").toObject().months;
  if (monthsDiff > 1) {
    // if request is in the future and today is not displayed.
    maxAge = 60 * 60 * 24; // cache for a day
  } else if (monthsDiff < 0) {
    // if request is in the past and today is not displayed.
    maxAge = 60 * 60 * 24 * 7; // cache for 7 days
  } else if (Info.features().zones) {
    // get the diff in seconds to the next shift start
    const now = DateTime.local().setZone("Europe/Berlin");
    context.res.setHeader("X-Server-Luxon-Time", now.toFormat("HH':'mm"));

    let hour = 6; // get next shift start
    if (now.hour >= 22) {
      hour = 6;
    } else if (now.hour >= 14) {
      hour = 22;
    } else if (now.hour >= 6) {
      hour = 14;
    }

    let nextShift = now.set({
      hour,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (nextShift.diff(now, "minutes").toObject().minutes < 0) {
      nextShift = nextShift.plus({ days: 1 });
    }
    maxAge = nextShift.diff(now, "seconds").toObject().seconds;
  }

  context.res.setHeader("Cache-Control", "s-maxage=" + maxAge);
  return {
    props: context.query,
  };
}
