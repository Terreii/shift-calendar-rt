"use client";

/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { formatISO } from "date-fns/formatISO";
import { isWeekend } from "date-fns/isWeekend";
import { isMonday } from "date-fns/isMonday";
import { useParams } from "next/navigation";

import WeekCell from "./cells/week";
import DayInMonthCell from "./cells/dayInMonth";
import WeekDayCell from "./cells/weekDay";
import GroupShiftCell from "./cells/groupShift";

import style from "../styles/calendar.module.css";

/**
 * @typedef {Object} MonthData
 * @property {("F"|"S"|"N"|"K")[][]} days      List of working days of every group
 * @property {object}                holidays  Object containing all holidays of that month.
 */

/**
 * Renders the body of a month.
 * @param {Object}     arg          React arguments.
 * @param {number}     arg.year     Year of the month.
 * @param {number}     arg.month    Month of this month.
 * @param {MonthData}  arg.data     Data of this month.
 * @param {number[]}   [arg.today]  Array of numbers that contains todays date. [year, month, day].
 * @param {number}     [arg.search] Date of the search result. Or null.
 * @param {number}     arg.group    Group to display. 0 = All, 1 - 6 is group number
 * @returns {JSX.Element}
 */
export default function MonthBody({ year, month, data, today, search, group }) {
  const todayInThisMonth =
    today != null && today[0] === year && today[1] === month;
  const { shiftModel } = useParams();

  // Render every row/day.
  const dayRows = data.days.map((dayShiftsData, index) => {
    const dayInMonth = index + 1;
    const time = new Date(year, month, dayInMonth);
    const holidayData = data.holidays[dayInMonth];

    const shifts =
      group === 0
        ? dayShiftsData // if 0; display all groups
        : dayShiftsData.slice(group - 1, group); // else return array of one group number

    // isToday is true when the date is: actual today and up to 6:00am the day before.
    // Because the shifts work until 6am.
    const isToday = todayInThisMonth && dayInMonth === today[2];
    const isYesterday =
      !isToday && todayInThisMonth && dayInMonth + 1 === today[2];
    const isSearchResult = search === dayInMonth;

    const isClosingHoliday =
      holidayData != null && holidayData.type === "closing";

    let interesting;
    if (isSearchResult) {
      interesting = "search";
    } else if (isToday) {
      interesting = "today";
    }

    return (
      <tr
        key={index}
        id={"day_" + formatISO(time, { representation: "date" })}
        className={style.row}
        data-interest={interesting}
        data-weekend={isWeekend(time)}
        data-closing={isClosingHoliday ? "closing" : undefined}
        title={
          isToday || isClosingHoliday
            ? `${isToday ? "Heute" : ""} ${
                isClosingHoliday ? holidayData.name : ""
              }`.trim()
            : null
        }
      >
        {(isMonday(time) || index === 0) && <WeekCell time={time} />}
        <DayInMonthCell time={time} shiftModel={shiftModel} />
        <WeekDayCell
          time={time}
          holidayData={holidayData}
          dayLightSaving={data.holidays.daylightSavingSwitch}
        />

        {shifts.map((shift, index) => {
          const gr = group === 0 ? index : group - 1;
          return (
            <GroupShiftCell
              key={gr}
              group={gr}
              shift={shift}
              isToday={isToday}
              isYesterday={isYesterday}
              hour={today?.[3]}
              shiftModel={shiftModel}
            />
          );
        })}
      </tr>
    );
  });

  return <tbody>{dayRows}</tbody>;
}
