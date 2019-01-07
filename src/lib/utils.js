/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Gets the number of days in a month.
 * @param {number} year Full Year
 * @param {number} month Number of the month
 * @returns {number} Number of days in month
 */
export function getDaysInMonth (year, month) {
  // first day in month is 1. 0 is the one before --> last day of month!
  return new Date(year, month + 1, 0).getDate()
}
