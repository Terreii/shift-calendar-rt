/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Helmet from "preact-helmet";

import ByMonths from "../../components/Calendar/ByMonth";
import Downloader from "../../components/Download";
import Legend from "../../components/Legend";
import { shiftModelText } from "../../../lib/constants";
import { type ShiftModelKeys } from "../../../lib/shifts";
import { useTodayZeroIndex } from "../../hooks/time";

import style from "../../components/Calendar/style.module.css";

/**
 * Route that always displays today.
 */
export default function ShiftModel({
  params: { shiftModel },
}: {
  params: { shiftModel: ShiftModelKeys };
}) {
  const [year, month] = useTodayZeroIndex();

  return (
    <main class={style.main}>
      <Helmet
        title={`Monat ${year}-${String(month + 1).padStart(2, "0")} | ${
          shiftModelText[shiftModel]
        }`}
      />

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
