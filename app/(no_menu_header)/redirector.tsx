"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { redirect } from "next/navigation";
import { useEffect } from "react";

import { getToday, getTodayUrl } from "../../lib/utils";
import { type Settings } from "./shiftLink";

export default function Redirector() {
  useEffect(() => {
    const settings: Settings = JSON.parse(
      localStorage.getItem("settings") ?? "{}",
    );
    if (
      new URLSearchParams(window.location.search).has("pwa") &&
      settings.shiftModel
    ) {
      redirect(
        getTodayUrl({
          shiftModel: settings.shiftModel,
          group: 0,
          today: getToday(),
        }),
      );
    }
  }, []);

  return null;
}
