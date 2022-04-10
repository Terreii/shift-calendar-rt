/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import ms from "milliseconds";
import { useRouter } from "next/router";

import Month from "./month";
import selectMonthData from "../lib/select-month-data";
import { getCalUrl, scrollToADay } from "../lib/utils";
import { useTitleAlert } from "../hooks/utils";

import style from "../styles/calender.module.css";

/**
 * Display this month and the next 2 and the last one.
 * @param {object} param    React Props
 * @param {string} param.shiftModel     Shift model to display.
 * @param {number} param.group          Group to display 0 = all, >= 1 just one.
 * @param {number|null} param.search    Searched day.
 * @param {number} param.year           Year to display.
 * @param {number} param.month          Month to display.
 * @param {number[]} param.today        Todays date as an array of numbers [yyyy, mm, dd].
 */
export default function ByMonths({
  shiftModel,
  group,
  search,
  year,
  month,
  today,
}) {
  const ref = useHammer(year, month, shiftModel, group);
  const monthsToRender = useMonthToRender();
  const clickHandler = useTitleAlert();

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

  return (
    <div
      id="calendar_main_out"
      className={style.container}
      onClick={clickHandler}
      ref={ref}
      aria-live="polite"
    >
      {monthsData.map(([year, month, search], index) =>
        monthsToRender[index] ? (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            className={style.calender_table}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            today={today[0] === year && today[1] === month ? today : null}
            search={search != null ? +search : null}
            group={group}
          />
        ) : (
          <table
            key={`${year}-${month}-${shiftModel}-${group}`}
            id={`month_${year}-${month + 1}`}
            className={`${style.table} ${style.calender_table}`}
            aria-hidden
          />
        )
      )}
    </div>
  );
}

/**
 * Calcs which month should be rendered.
 * @param {number} width   The innerWidth of the window.
 * @returns {[boolean, boolean, boolean, boolean]} Which months should be rendered.
 */
function calcMonthsToDisplay(width) {
  return [width >= 1536, true, width >= 768, width >= 1280];
}
let isFirstRender = true;

function useMonthToRender() {
  const [monthsToRender, setMonthsToRender] = useState(() =>
    isFirstRender // true on server and on first render
      ? [false, true, false, false]
      : calcMonthsToDisplay(window.innerWidth)
  );

  useLayoutEffect(() => {
    let lastWidth = 0;
    isFirstRender = false;

    const updateMonths = () => {
      const nextMonths = calcMonthsToDisplay(window.innerWidth);
      setMonthsToRender((lastMonths) =>
        nextMonths.every(
          (shouldRender, index) => shouldRender === lastMonths[index]
        )
          ? lastMonths
          : nextMonths
      );
    };
    updateMonths();

    const handler = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        updateMonths();
      }
    };

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return monthsToRender;
}

/**
 * Setup Hammer and handle swipes.
 * @param {number}   year        The current year.
 * @param {number}   month       The current month.
 * @param {string}   shiftModel  Selected shift-model.
 * @param {number}   group       Shift group.
 */
function useHammer(year, month, shiftModel, group) {
  const [container, setContainer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (container == null) return;
    let isActive = true;

    const handler = (event) => {
      switch (event.direction) {
        case 2: {
          // right to left
          const time = new Date();
          time.setDate(1);
          time.setMonth(month);
          time.setFullYear(year);
          time.setTime(time.getTime() + ms.months(1));

          router.push(
            getCalUrl({
              group,
              shiftModel,
              isFullYear: false,
              year: time.getFullYear(),
              month: time.getMonth() + 1,
            })
          );
          break;
        }

        case 4: {
          // left to right
          const time = new Date();
          time.setDate(1);
          time.setMonth(month);
          time.setFullYear(year);
          time.setTime(time.getTime() - ms.months(1));

          router.push(
            getCalUrl({
              group,
              shiftModel,
              isFullYear: false,
              year: time.getFullYear(),
              month: time.getMonth() + 1,
            })
          );
          break;
        }

        default:
          break;
      }
    };

    let hammertime;
    import("hammerjs").then(({ default: Hammer }) => {
      if (isActive) {
        hammertime = new Hammer(container);
        hammertime.on("swipe", handler);
      }
    });
    return () => {
      isActive = false;
      if (hammertime) {
        hammertime.off("swipe", handler);
      }
    };
  }, [year, month, shiftModel, group, container, router]);

  return setContainer;
}
