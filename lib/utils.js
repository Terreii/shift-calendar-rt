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

export function getIsSSR () {
  try {
    return !('document' in window)
  } catch (err) {
    return true
  }
}

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

export function getCalUrl ({
  shiftModel,
  isFullYear = false,
  year,
  month,
  group = 0,
  search = null
} = {}) {
  const params = new URLSearchParams()

  if (search != null && !Number.isNaN(search)) {
    params.set('search', search)
  }
  if (group > 0) {
    params.set('group', group)
  }
  const paramsString = params.toString()
  const paramsStr = paramsString.length > 0 ? '?' + paramsString : ''

  if (year == null) {
    return `/cal/${shiftModel}${paramsStr}`
  }

  if (isFullYear) {
    return `/cal/${shiftModel}/${year}${paramsStr}`
  } else {
    const monthNum = month != null && month > 0 && month <= 12
      ? month
      : new Date().getMonth() + 1
    const monthStr = String(monthNum).padStart(2, '0')
    return `/cal/${shiftModel}/${year}/${monthStr}${paramsStr}`
  }
}

/**
 * Get today as an array of [yyyy, m, d, h] (all numbers).
 */
export function getToday () {
  const now = new Date()
  return [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours()
  ]
}

export function parseNumber (str, fallback) {
  const num = parseInt(str, 10)
  const result = Number.isNaN(num) ? fallback : num
  return result
}
