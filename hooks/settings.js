/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  shift66Name,
  shiftModelNames,
  shiftModelNumberOfGroups,
} from "../lib/constants";
import { useToday } from "./time";

/**
 * Get the stored or current month.
 * @returns {{
 *   url: string,
 *   isFullYear: boolean,
 *   year: number,
 *   month: number,
 *   shiftModel: string,
 *   group: number,
 *   search: number | null
 * }}
 */
export function useQueryProps() {
  const router = useRouter();

  const {
    asPath: url,
    query: {
      shiftModel,
      year: yearStr,
      month: monthStr,
      group: groupStr = "0",
      search: searchStr,
    },
  } = router;

  const today = useToday();
  const isFullYear = !monthStr && yearStr != null;
  const year = parseInt(yearStr) || today[0];
  const month = isFullYear ? 1 : parseInt(monthStr) || today[1];
  const group = parseInt(groupStr);
  const search =
    searchStr && !Number.isNaN(searchStr) ? parseInt(searchStr, 10) : null;

  const [storedSettings, setStoredSettings] = useState({
    shiftModel: shiftModel ?? shift66Name,
    group: Number.isNaN(group) ? 0 : group,
  });
  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem("settings")) ?? {};
    if (settings.didSelectModel) {
      setStoredSettings((old) => {
        if (
          (settings.shiftModel != null &&
            old.shiftModel !== settings.shiftModel) ||
          (settings.group != null && old.group !== settings.group)
        ) {
          return {
            shiftModel: settings.shiftModel,
            group: settings.group,
          };
        }
        return old;
      });
    }
  }, [url]);

  return {
    url,
    isFullYear,
    year,
    month,
    shiftModel: shiftModel ?? storedSettings.shiftModel,
    group: Number.isNaN(group) ? storedSettings.group : group,
    search,
  };
}

/**
 * Stores the last selected shiftModel and group.
 * @param {string} url           Current active url-path.
 * @param {string} [shiftModel]  Selected shift model.
 * @param {number} group         Group to display.
 */
export function useSaveSettings(url, shiftModel, group) {
  useEffect(() => {
    if (!url.startsWith("/cal")) return;

    if (shiftModelNames.includes(shiftModel)) {
      const isGroupValid =
        typeof group === "number" &&
        group <= shiftModelNumberOfGroups[shiftModel] &&
        group >= 0;

      window.localStorage.setItem(
        "settings",
        JSON.stringify({
          didSelectModel: true,
          shiftModel,
          group: isGroupValid ? group : 0,
        }),
      );
    }
  }, [url, shiftModel, group]);
}
