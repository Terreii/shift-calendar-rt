/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import classNames from "classnames";
import { memo } from "preact/compat";

import MonthBody from "./MonthBody";
import { monthNames } from "../../../lib/constants";
import { useTodayZeroIndex } from "../../hooks/time";

/**
 * Render a month
 * @param {Object}    arg0          React/Preact arguments.
 * @param {number}    arg0.year     Year of the month.
 * @param {number}    arg0.month    Month number in the year of this month.
 * @param {Object}    arg0.data     Month-data that contains all workdays and holidays of that month.
 * @param {?number}   arg0.search   Date of the search result. Or null.
 * @param {number}    arg0.group    Group to display. 0 = All, 1 - 6 is group number
 * @param {boolean?}  arg0.shouldTranistionToNewPosition  This is the only displayed month. This is for mobile.
 * @returns {JSX.Element}
 */
function Month({
  class: className = "",
  year,
  month,
  data,
  search,
  group,
  shouldTranistionToNewPosition = false,
}) {
  const groups = [];

  if (group === 0) {
    // if 0 display all groups
    for (let i = 0, max = data.workingCount.length; i < max; ++i) {
      groups.push(i);
    }
  } else {
    // else return array of one group number
    groups.push(group - 1);
  }

  const today = useTodayZeroIndex();
  const isToday = today[0] === year && today[1] === month;

  return (
    <table
      id={`month_${year}-${month + 1}`}
      class={classNames(
        "mt-8 table-fixed border-separate border-spacing-0 border border-t-0 text-center text-black xl:mt-0",
        className,
      )}
      aria-labelledby={`month_${year}-${month + 1}_caption`}
      style={
        shouldTranistionToNewPosition
          ? {
              viewTransitionName: `month_table_${year}-${month + 1}`,
            }
          : null
      }
    >
      <caption
        id={`month_${year}-${month + 1}_caption`}
        class={classNames("sticky top-12 z-10 border-b-white py-1 font-bold", {
          "border border-b-0 border-black bg-gray-300": isToday,
          "border-b bg-white": !isToday,
        })}
      >
        {monthNames[month]} {year}
        {isToday ? " (Jetzt)" : ""}
      </caption>
      <thead class="sticky top-20 z-10 border-t border-black">
        <tr>
          <th rowSpan={2} class="border border-black bg-white">
            <span class="sr-only">Woche</span>
            <span aria-hidden="true" title="Woche">
              Wo
            </span>
          </th>
          <th
            rowSpan={2}
            class="border border-l-0 border-black bg-white min-[280px]:min-w-12"
          >
            Tag
          </th>
          <th
            rowSpan={2}
            class="border border-l-0 border-black bg-white min-[280px]:min-w-12"
          >
            <span class="sr-only">Wochentag</span>
          </th>
          <th
            colSpan={groups.length}
            class="border border-b-0 border-l-0 border-black bg-white"
          >
            Gruppen
          </th>
        </tr>
        <tr>
          {groups.map((gr) => (
            <th
              key={gr}
              class="border border-l-0 border-black bg-white last:border-r max-[365px]:px-2 min-[365px]:min-w-8"
            >
              {gr + 1}
            </th>
          ))}
        </tr>
      </thead>

      <MonthBody
        year={year}
        month={month}
        data={data}
        today={today}
        search={search}
        group={group}
      />

      <tfoot class="text-sm font-bold">
        <tr>
          <td
            class="cursor-help border border-b-0 p-1"
            colSpan="3"
            title="Summe der Tage an denen eine Schichtgruppe diesen Monat arbeitet."
          >
            Summe
          </td>
          {groups.map((gr) => (
            <td key={gr} aria-label="Summe Arbeitstage" class="border-b-0 p-1">
              {data.workingCount[gr]}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
}

export default memo(Month);
