/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
import { Router, Route, useLocation } from "preact-iso";

import CurrentMonth from "./CurrentMonth";
import FullYear from "./FullYear";
import { shiftModelNames } from "../../../lib/constants";
import { ShiftModelKeys } from "../../../config/shifts";

export default function CalendarRouter({ rest }: { rest: string }) {
  const { route } = useLocation();
  if (!shiftModelNames.includes(rest.split("/")[1] as ShiftModelKeys)) {
    route("/", true);
    return null;
  }

  return (
    <Router>
      <Route path="/:shiftModel" component={CurrentMonth} />
      <Route path="/:shiftModel/:year" component={FullYear} />
      <Route default component={Redirector} />
    </Router>
  );
}

function Redirector() {
  const { route } = useLocation();
  route("/", true);
  return null;
}
