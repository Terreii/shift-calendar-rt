/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Head from "next/head";
import { useRouter } from "next/router";
import differenceInSeconds from "date-fns/differenceInSeconds";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";

import ByMonths from "../../components/by-month";
import Downloader from "../../components/download";
import Legend from "../../components/legend";
import { useTodayZeroIndex, useUnloadedFix } from "../../hooks/time";
import { shiftModelNames, shiftModelText } from "../../lib/constants";
import { parseNumber } from "../../lib/utils";

import style from "../../styles/calendar.module.css";

/**
 * Route that always displays today.
 */
export default function ShiftModel() {
  const router = useRouter();
  const today = useTodayZeroIndex();
  const shiftModel = router.query.shiftModel;
  const group = parseNumber(router.query.group, 0);
  const year = today[0];
  const month = today[1];

  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
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

      <Legend shiftKey={shiftModel} />

      <ByMonths
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

/**
 * Get the props for server side rendering.
 * @param {import('next').GetServerSidePropsContext} context Next SSR context.
 * @returns {import('next').GetServerSidePropsResult}
 */
export async function getServerSideProps(context) {
  const shiftModel = context.query.shiftModel;
  if (!shiftModelNames.includes(shiftModel)) {
    context.res.writeHead(307, {
      Location: "/",
    });
    return;
  }

  const now = new Date();
  const cacheTill = roundToNearestMinutes(now, {
    nearestTo: 30,
    roundingMethod: "ceil",
  });
  const cacheSeconds = differenceInSeconds(cacheTill, now);
  context.res.setHeader("Cache-Control", "s-maxage=" + cacheSeconds);
  context.res.setHeader(
    "Set-Cookie",
    `shift_model=${shiftModel}; Max-Age=31536000; Path=/; Secure; HttpOnly; SameSite=Lax`,
  );
  return {
    props: context.query,
  };
}
