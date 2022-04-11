/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Head from "next/head";
import { useRouter } from "next/router";

import ByMonths from "../../../../components/by-month";
import Downloader from "../../../../components/download";
import Legend from "../../../../components/legend";
import { useTodayZeroIndex, useUnloadedFix } from "../../../../hooks/time";
import { shiftModelNames, shiftModelText } from "../../../../lib/constants";
import { parseNumber } from "../../../../lib/utils";

import style from "../../../../styles/calender.module.css";

export default function MonthPage() {
  const router = useRouter();
  const today = useTodayZeroIndex(true);
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
          {`Monat ${today[0]}-${String(today[1] + 1).padStart(2, "0")} - ${
            shiftModelText[shiftModel]
          } - `}
          Schichtkalender für Bosch Reutlingen
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

      <Downloader shiftModel={shiftModel} />
    </main>
  );
}

/**
 * Get the paths that should to prerender.
 * @returns {import('next').GetStaticPathsResult}
 */
export async function getStaticPaths() {
  const paths = [];
  const add = (shiftModel, date) => {
    paths.push({
      params: {
        shiftModel,
        year: date.getUTCFullYear().toString(),
        month: date.getUTCMonth().toString().padStart(2, "0"),
      },
    });
  };

  const year = new Date().getUTCFullYear();
  const month = new Date().getUTCMonth();

  for (const model of shiftModelNames) {
    for (const monthDiff of [-1, 0, 1, 2, 3]) {
      const date = new Date(year, month + monthDiff, 1, 3, 0, 0, 0);
      add(model, date);
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
}

/**
 * Get the paths data.
 * @param {import('next').GetStaticPropsContext} context  Data.
 * @returns {import('next').GetStaticPropsResult}
 */
export function getStaticProps(context) {
  if (Number.isNaN(parseInt(context.params?.year))) {
    return {
      notFound: true,
    };
  }
  const month = parseInt(context.params?.month);
  if (Number.isNaN(month) || month <= 0 || month > 12) {
    return {
      notFound: true,
    };
  }
  if (!(context.params?.shiftModel in shiftModelText)) {
    return {
      notFound: true,
    };
  }

  return { props: {} };
}
