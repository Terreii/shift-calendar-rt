/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { type ComponentChildren } from "preact";

import Container from "../../components/Calendar/container";
import Month from "../../components/Calendar/Month";
import { shiftModelText } from "../../../lib/constants";
import { type ShiftModelKeys } from "../../../lib/shifts";
import selectMonthData from "../../../lib/select-month-data";
import { parseNumber, titleAlertHandler } from "../../../lib/utils";
import { useUnloadedFix } from "../../hooks/time";

export default function Year({
  params: { shiftModel, year: yearString },
}: {
  params: { shiftModel: ShiftModelKeys; year: string };
}) {
  const year = parseNumber(yearString, null);

  if (year == null || year < 1990) {
    return (
      <section class="mb-40 mt-20 min-w-full pt-4 text-center">
        <h2 class="text-xl font-bold">
          {yearString} ist nicht ein erlaubtes Jahr.
        </h2>
        <p>Es werden nur Jahre zwischen 1990 und 2100 unterstützt.</p>
      </section>
    );
  }

  const monthsData: [number, number][] = [];
  for (let i = 0; i < 12; i++) {
    monthsData.push([year, i]);
  }

  return (
    <Container
      title={`Jahr ${year} - ${shiftModelText[shiftModel]}`}
      model={shiftModel}
      year={year}
      month={0}
    >
      <UnloadFixContainer>
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
      </UnloadFixContainer>
    </Container>
  );
}

function UnloadFixContainer({ children }: { children: ComponentChildren }) {
  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
  }

  return (
    <div
      id="calendar_main_out"
      class="mx-auto flex touch-pan-y flex-col items-start gap-6 pb-2 min-[365px]:px-5 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      onClick={titleAlertHandler}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
