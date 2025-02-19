/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { TZDate } from "@date-fns/tz";
/**
 * Gets the number of days in a month.
 * @param {number} year Full Year
 * @param {number} month Number of the month
 * @returns {number} Number of days in month
 */
export function getDaysInMonth(year, month) {
  // first day in month is 1. 0 is the one before --> last day of month!
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Scroll to a day. But only if that day is displayed.
 * @param {number} year  The year of the day.
 * @param {number} month The month of the day.
 * @param {number} day   The day in month.
 */
export function scrollToADay(year, month, day) {
  const row = Number.isNaN(parseInt(day, 10))
    ? null
    : document.querySelector(
        `#month_${year}-${month + 1} tr:nth-child(${day})`,
      );

  if (row != null && row.scrollIntoView != null) {
    row.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

/**
 * Get the URL for a calendar page.
 * @param {object} param   Param Object
 * @param {import("./shifts").ShiftModelKeys}  param.shiftModel    Key of the ShiftModel used.
 * @param {boolean}           [param.isFullYear]  Should the URL be the full year page url.
 * @param {number}            [param.year]        Year of the page.
 * @param {number}            [param.month]       Month of the page. Defaults to current month.
 *                                                Ignored if isFullYear = true.
 * @param {number | null}     [param.day]         Day to scroll to.
 * @returns {string} The page url path.
 */
export function getCalUrl({
  shiftModel,
  isFullYear = false,
  year,
  month,
  day = null,
} = {}) {
  if (year == null) {
    return `/cal/${shiftModel}`;
  }

  if (isFullYear) {
    return `/cal/${shiftModel}/${year}`;
  }
  const monthNum =
    month != null && month > 0 && month <= 12
      ? month
      : TZDate.tz("Europe/Berlin").getMonth() + 1;
  const monthStr = String(monthNum).padStart(2, "0");
  const hashStr =
    day !== null && !Number.isNaN(day)
      ? `#day_${year}-${monthStr}-${String(day).padStart(2, "0")}`
      : "";
  return `/cal/${shiftModel}/${year}/${monthStr}${hashStr}`;
}

/**
 * Get the url to display today.
 * @param {object}   param args
 * @param {string}   param.shiftModel   Current shift model.
 * @param {number[]} [param.today]      Today array.
 * @param {number}   param.group        Group to display.
 */
export function getTodayUrl({ shiftModel, today, group }) {
  const groupArg = group && group > 0 ? `?group=${group}` : "";

  if (today) {
    const month = String(today[1]).padStart(2, "0");
    const day = String(today[2]).padStart(2, "0");
    return `/cal/${shiftModel}${groupArg}#day_${today[0]}-${month}-${day}`;
  }
  return `/cal/${shiftModel}${groupArg}`;
}

/**
 * Get today as an array of [yyyy, m, d, h] (all numbers).
 * @returns {[number,number,number,number,number]} [Year, month (start at 1), day, hour, minutes]
 */
export function getToday() {
  const now = getTodayZeroIndex();
  now[1]++;
  return now;
}

/**
 * Get today as an array of [yyyy, m, d, h, min] (all numbers). But with month begining at 0.
 * @returns {[number,number,number,number,number]} [Year, month (start at 0), day, hour, minutes]
 */
export function getTodayZeroIndex() {
  const now = TZDate.tz("Europe/Berlin");
  return [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    Math.floor(now.getMinutes() / 5) * 5,
  ];
}

export function parseNumber(str, fallback) {
  const num = parseInt(str, 10);
  const result = Number.isNaN(num) ? fallback : num;
  return result;
}

/**
 * Handles click Events on elements with a title and displays them.
 * @param {MouseEvent} event  MouseEvent of an click.
 */
export function titleAlertHandler(event) {
  if (event.target instanceof HTMLElement) {
    const title = event.target.closest("[title]")?.title?.trim() ?? "";
    if (title) {
      window.alert(title);
    }
  }
}
