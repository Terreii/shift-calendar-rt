/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import ByMonths from "../../components/Calendar/ByMonth";
import Container from "../../components/Calendar/container";
import { shiftModelText } from "../../../lib/constants";
import { type ShiftModelKeys } from "../../../lib/shifts";
import { useTodayZeroIndex } from "../../hooks/time";

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
    <Container
      title={`Monat ${year}-${String(month + 1).padStart(2, "0")} | ${
        shiftModelText[shiftModel]
      }`}
      model={shiftModel}
      year={year}
      month={month}
    >
      <ByMonths
        key="today"
        shiftModel={shiftModel}
        group={0}
        search={null}
        year={year}
        month={month}
      />
    </Container>
  );
}
