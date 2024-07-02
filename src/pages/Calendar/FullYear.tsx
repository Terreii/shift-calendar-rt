/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ComponentChildren } from "preact";
import Helmet from "preact-helmet";

import Month from "../../components/Calendar/Month";
import Downloader from "../../components/Download";
import Legend from "../../components/Legend";
import { shiftModelText, type ShiftModels } from "../../../lib/constants";
import selectMonthData from "../../../lib/select-month-data";
import { parseNumber, titleAlertHandler } from "../../../lib/utils";
import { useUnloadedFix } from "../../hooks/time";

import style from "../../components/Calendar/style.module.css";

export default function Year({
  params: { shiftModel, year: yearString },
}: {
  params: { shiftModel: ShiftModels; year: string };
}) {
  const year = parseNumber(yearString, null);

  if (year == null) {
    return <h2>{yearString} is not a valid year.</h2>;
  }

  const monthsData: [number, number][] = [];
  for (let i = 0; i < 12; i++) {
    monthsData.push([year, i]);
  }

  return (
    <main class={style.main}>
      <Helmet title={`Jahr ${year} - ${shiftModelText[shiftModel]}`} />

      <Legend shiftKey={shiftModel} year={year} month={0} />

      <Container>
        {monthsData.map(([year, month]) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${0}`}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            group={0}
            shouldTranistionToNewPosition={false}
            search={null}
          />
        ))}
      </Container>

      <Downloader shiftModel={shiftModel} year={year} />
    </main>
  );
}

function Container({ children }: { children: ComponentChildren }) {
  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
  }

  return (
    <div
      id="calendar_main_out"
      class={style.container}
      onClick={titleAlertHandler}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
