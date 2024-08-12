/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import ByMonths from "../../components/Calendar/ByMonth";
import Container from "../../components/Calendar/container";
import { shiftModelText } from "../../../lib/constants";
import { type ShiftModelKeys } from "../../../lib/shifts";
import { parseNumber } from "../../../lib/utils";

export default function MonthPage({
  params: { shiftModel, year: yearString, month: monthString },
}: {
  params: { shiftModel: ShiftModelKeys; year: string; month: string };
}) {
  const year = parseNumber(yearString, null);
  const monthQuery = parseNumber(monthString, null);
  const month = monthQuery ? monthQuery - 1 : monthQuery;

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
  if (month == null || month < 0 || month > 11) {
    return (
      <section class="mb-40 mt-20 min-w-full pt-4 text-center">
        <h2 class="text-xl font-bold">
          {monthString} ist nicht ein erlaubter Monat.
        </h2>
        <p>Es gibt nur 12 Monate. Benutze eine Zahl von 1 bis 12.</p>
      </section>
    );
  }

  return (
    <Container
      title={`Monat ${year}-${monthString.padStart(2, "0")} | ${
        shiftModelText[shiftModel]
      }`}
      model={shiftModel}
      year={year}
      month={month}
    >
      <ByMonths
        key={`${year}-${month}`}
        shiftModel={shiftModel}
        group={0}
        search={null}
        year={year}
        month={month}
      />
    </Container>
  );
}
