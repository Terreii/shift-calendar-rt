/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useMemo, useRef } from "preact/hooks";
import { useLocation } from "preact-iso";
import addMonths from "date-fns/addMonths";
import { useViewTransition } from "use-view-transitions/react";

import Month from "./Month";
import selectMonthData from "../../../lib/select-month-data";
import { getCalUrl, scrollToADay } from "../../../lib/utils";
import { useTitleAlert, useSwipe } from "../../../hooks/utils";
import { useUnloadedFix } from "../../../hooks/time";

import style from "./style.module.css";

/**
 * Display this month and the next 2 and the last one.
 * @param {object} param    React Props
 * @param {string} param.shiftModel     Shift model to display.
 * @param {number} param.group          Group to display 0 = all, >= 1 just one.
 * @param {number|null} param.search    Searched day.
 * @param {number} param.year           Year to display.
 * @param {number} param.month          Month to display.
 */
export default function ByMonths({ shiftModel, group, search, year, month }) {
  const { route } = useLocation();
  const { startViewTransition } = useViewTransition();
  const { ref, isSwiping, x } = useSwipe((direction) => {
    if (direction) {
      startViewTransition(() => {
        route(getSwipeNextMonthUrl(direction, year, month, group, shiftModel));
      });
    }
  });
  const monthsToRender = useMonthToRender();
  const clickHandler = useTitleAlert();
  const multiMonthView = monthsToRender[2]; // if next month (or more) is rendered.

  const monthsData = useMemo(() => {
    const monthsData = [];
    for (let i = 0; i < 4; ++i) {
      let monthNr = month + (i - 1);
      let yearNr = year;

      if (search && monthNr === month && yearNr === year) {
        monthsData.push([year, month, search]);
        continue;
      }

      if (monthNr > 11) {
        monthNr -= 12;
        yearNr += 1;
      } else if (monthNr < 0) {
        monthNr += 12;
        yearNr -= 1;
      }

      monthsData.push([yearNr, monthNr]);
    }
    return monthsData;
  }, [year, month, search]);

  const lastSearch = useRef(null);
  useEffect(() => {
    if (search !== lastSearch.current) {
      lastSearch.current = search;
      scrollToADay(year, month, search);
    }
  }, [year, month, search]);

  const shouldRemoveCalendar = useUnloadedFix();
  if (shouldRemoveCalendar) {
    return null;
  }

  return (
    <div
      id="calendar_main_out"
      class={isSwiping ? style.swiping_container : style.container}
      style={{ "--swipe-offset": `${x}px` }}
      onClick={clickHandler}
      ref={ref}
      aria-live="polite"
    >
      {monthsData.map(([year, month, search], index) =>
        monthsToRender[index] ? (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            class={style.calender_table}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            search={search != null ? +search : null}
            group={group}
            shouldTranistionToNewPosition={multiMonthView}
          />
        ) : (
          <table
            key={`${year}-${month}-${shiftModel}-${group}`}
            id={`month_${year}-${month + 1}`}
            class={`${style.table} ${style.calender_table} ${style.calender_table_placeholder}`}
            aria-hidden
          />
        ),
      )}
    </div>
  );
}

/**
 * Get the next url of the next month on a swipe.
 * @param {"right"|"left"} direction   Direction the swipe is going.
 * @param {number}         year        Current Year.
 * @param {number}         month       Current Month.
 * @param {number}         group       Group to display 0 = all, >= 1 just one.
 * @param {string}         shiftModel  Shift model to display.
 * @returns {string}  Next URL.
 */
function getSwipeNextMonthUrl(direction, year, month, group, shiftModel) {
  const swipeMonthChange = { left: 1, right: -1 };
  const time = addMonths(new Date(year, month, 1), swipeMonthChange[direction]);
  return getCalUrl({
    group,
    shiftModel,
    isFullYear: false,
    year: time.getFullYear(),
    month: time.getMonth() + 1,
  });
}

/**
 * Calcs which month should be rendered.
 * @param {number} width   The innerWidth of the window.
 * @returns {[boolean, boolean, boolean, boolean]} Which months should be rendered.
 */
function calcMonthsToDisplay(width) {
  return [width >= 1530, true, width >= 760, width >= 1274];
}
let isFirstRender = true;

function useMonthToRender() {
  const [monthsToRender, setMonthsToRender] = useState(() =>
    calcMonthsToDisplay(
      isFirstRender // true on server and on first render
        ? 512
        : window.innerWidth,
    ),
  );

  useEffect(() => {
    let lastWidth = 0;
    let lastOrientation = screen?.orientation?.type ?? "portrait-primary";
    isFirstRender = false;

    const updateMonths = () => {
      const nextMonths = calcMonthsToDisplay(window.innerWidth);
      setMonthsToRender((lastMonths) =>
        nextMonths.every(
          (shouldRender, index) => shouldRender === lastMonths[index],
        )
          ? lastMonths
          : nextMonths,
      );
    };
    updateMonths();

    const abortController = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          updateMonths();
        }
      },
      {
        signal: abortController.signal,
      },
    );
    screen.orientation.addEventListener(
      "change",
      () => {
        if (window.screen?.orientation?.type !== lastOrientation) {
          lastOrientation = screen?.orientation?.type;
          setTimeout(() => {
            if (!abortController.signal.aborted) {
              updateMonths();
            }
          }, 25);
        }
      },
      {
        signal: abortController.signal,
      },
    );
    return () => {
      abortController.abort();
    };
  }, []);

  return monthsToRender;
}
