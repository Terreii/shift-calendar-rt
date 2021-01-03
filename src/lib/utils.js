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

/**
 * Is this running on the server (true) or in a browser (false).
 */
export const isSSR = (() => {
  try {
    const isBrowser = 'document' in window && 'navigator' in window
    return !isBrowser
  } catch (err) {
    return true
  }
})()

/**
 * Scroll to a day. But only if that day is displayed.
 * @param {number} year  The year of the day.
 * @param {number} month The month of the day.
 * @param {number} day   The day in month.
 */
export function scrollToADay (year, month, day) {
  const row = document.querySelector(`#month_${year}-${month + 1} tr:nth-child(${day})`)

  if (row != null && row.scrollIntoView != null) {
    row.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}
