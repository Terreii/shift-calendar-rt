/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
import { useEffect } from "preact/hooks";
import { Router, Route, useLocation } from "preact-iso";

import CurrentMonth from "./CurrentMonth";
import FullYear from "./FullYear";
import Month from "./Month";
import { shiftModelNames } from "../../../lib/constants";
import { ShiftModelKeys } from "../../../lib/shifts";

export default function CalendarRouter({ rest }: { rest: string }) {
  const { route, url } = useLocation();
  useHashScroll(url);

  if (!shiftModelNames.includes(rest.split("/")[1] as ShiftModelKeys)) {
    route("/", true);
    return null;
  }

  return (
    <Router>
      <Route path="/:shiftModel" component={CurrentMonth} />
      <Route path="/:shiftModel/:year" component={FullYear} />
      <Route path="/:shiftModel/:year/:month" component={Month} />
      <Route default component={Redirector} />
    </Router>
  );
}

function Redirector() {
  const { route } = useLocation();
  route("/", true);
  return null;
}

/**
 * Replicate the scroll to element with ID in hash behaviour of the browser.
 * @param pathWithHash  URL (path, query & hash) where to scroll to.
 */
function useHashScroll(pathWithHash: string) {
  useEffect(() => {
    const url = new URL(pathWithHash, window.location.href);
    if (url.hash.length <= 1) return;

    const element = document.getElementById(url.hash.replace(/^#/, ""));
    if (!element) return;

    element.scrollIntoView();
  }, [pathWithHash]);
}
