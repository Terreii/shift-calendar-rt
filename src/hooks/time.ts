/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from "preact/hooks";

import { getToday, getTodayZeroIndex } from "../../lib/utils";

export type TimeArray = [number, number, number, number, number];

function useTodayCore(getterFn: () => TimeArray): TimeArray {
  const [today, setToday] = useState(getterFn);

  useEffect(() => {
    const update = () => {
      const nextToday = getterFn();
      if (nextToday.some((v, i) => v !== today[i])) {
        setToday(nextToday);
      }
    };

    // timeout for updating in the background and if the page is in focus.
    const now = Date.now();
    const then = new Date(now);
    // The next 5 minutes
    then.setMinutes(Math.floor(then.getMinutes() / 5) * 5 + 5);
    then.setSeconds(0);
    const timeout = setTimeout(update, then.getTime() - now);

    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener("focus", update);
      clearTimeout(timeout);
    };
  }, [today, getterFn]);

  return today;
}

/**
 * Returns today [year, month, day, hour] and auto updates.
 * Month is 1-12.
 */
export function useToday(): TimeArray {
  return useTodayCore(getToday);
}

/**
 * Returns today [year, month, day, hour] and auto updates.
 * Month is 0-11.
 */
export function useTodayZeroIndex(): TimeArray {
  return useTodayCore(getTodayZeroIndex);
}

/**
 * Fix to update the today border and switching of months in the [shiftModel] page,
 * after a tab was unloaded and restored.
 *
 * It does it by completely re-render the calendar's tables. By removing them and then add them back.
 *
 * If the result is true, then the calendar should not be rendered.
 */
export function useUnloadedFix(): boolean {
  const [shouldRemoveCalendar, setRemoveCalendar] = useState(false);

  useEffect(() => {
    const today = getToday();
    const todayRows = Array.from(
      document.querySelectorAll('tr[data-interest="today"]'),
    );

    const update = () => {
      setRemoveCalendar(true);
    };

    if (todayRows.length === 0) {
      // there aren't any today rows visible, check if the current month is rendered,
      // and reload the calendar if so.
      const currentMonth = document.querySelector(
        `#month_${today[0]}-${today[1]}`,
      );
      if (currentMonth != null) {
        update();
        return;
      }
    }

    const dateStr = today
      .slice(0, 3)
      .map((n) => n.toString().padStart(2, "0"))
      .join("-");
    if (!todayRows.some((row) => row.id === dateStr)) {
      // none of the today rows had the current date. So the calendar must be re-rendered.
      update();
    }
  }, []);

  useEffect(() => {
    if (shouldRemoveCalendar) {
      // restore the calendar after it was removed
      const cancel = requestAnimationFrame(() => {
        setRemoveCalendar(false);
      });
      return () => {
        cancelAnimationFrame(cancel);
      };
    }
  }, [shouldRemoveCalendar]);

  return shouldRemoveCalendar;
}
