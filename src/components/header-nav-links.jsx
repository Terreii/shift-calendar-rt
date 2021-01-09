/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Fragment } from 'preact'
import { useMemo } from 'preact/hooks'
import { Link } from 'preact-router'
import ms from 'milliseconds'

import { getCalUrl } from '../lib/utils'

/**
 * Display 3 links to move in the calendar.
 * One button is move to today. And the other once are to move to the next/previous month/year.
 * @param {object}   param             Preact params.
 * @param {number[]} param.today       Array of [yyyy, m, d, h] for today.
 * @param {number}   param.year        Current active year.
 * @param {number}   param.month       Current active month.
 * @param {boolean}  param.isFullYear  Is the full year shown?
 * @param {string}   param.shiftModel  The current shift model.
 * @param {number}   param.group       Selected group to display. 0 = all, >= 1 only one.
 * @param {function} param.onClick     Call back for moving to today.
 */
export default function HeaderNavLinks ({
  today,
  year,
  month,
  isFullYear,
  shiftModel,
  group,
  onClick
}) {
  const { lastMonth, nextMonth } = useMemo(() => {
    const then = new Date()
    then.setFullYear(year)
    then.setMonth(month - 1)

    return {
      lastMonth: getMonthUrl(then.getTime() - ms.months(1), isFullYear, shiftModel, group),
      nextMonth: getMonthUrl(then.getTime() + ms.months(1), isFullYear, shiftModel, group)
    }
  }, [year, month, isFullYear, shiftModel, group])

  return (
    <>
      <Link
        key={`previous_${year}_${month}`}
        href={lastMonth}
        class='inline-block px-4 py-3 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
        title={isFullYear ? 'voriges Jahr' : 'vorigen Monat'}
        aria-controls='calendar_main_out'
      >
        {'<'}
      </Link>

      <Link
        href={getCalUrl({
          group,
          shiftModel,
          year: today[0],
          month: today[1]
        })}
        class='inline-block px-4 py-3 text-white bg-transparent hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
        title='zeige aktuellen Monat'
        onClick={onClick}
      >
        Heute
      </Link>

      <Link
        key={`next_${year}_${month}`}
        href={nextMonth}
        class='inline-block px-4 py-3 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
        title={isFullYear ? 'nächstes Jahr' : 'nächster Monat'}
        aria-controls='calendar_main_out'
      >
        {'>'}
      </Link>
    </>
  )
}

function getMonthUrl (time, isFullYear, shiftModel, group) {
  const t = new Date(time)
  return getCalUrl({
    group,
    shiftModel,
    isFullYear,
    year: t.getFullYear(),
    month: t.getMonth() + 1
  })
}