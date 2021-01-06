/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Fragment } from 'preact'
import { useMemo } from 'preact/hooks'
import { Link } from 'preact-router'
import ms from 'milliseconds'

/**
 * Display 3 links to move in the calendar.
 * One button is move to today. And the other once are to move to the next/previous month/year.
 * @param {object}   param             Preact params.
 * @param {number[]} param.today       Array of [yyyy, m, d, h] for today.
 * @param {number}   param.year        Current active year.
 * @param {number}   param.month       Current active month.
 * @param {boolean}  param.isFullYear  Is the full year shown?
 * @param {string}   param.shiftModel  The current shift model.
 * @param {function} param.onClick     Call back for moving to today.
 */
export default function HeaderNavLinks ({ today, year, month, isFullYear, shiftModel, onClick }) {
  const { lastMonth, nextMonth } = useMemo(() => {
    const then = new Date()
    then.setFullYear(year)
    then.setMonth(month)

    return {
      lastMonth: getMonthObj(then.getTime() - ms.months(1)),
      nextMonth: getMonthObj(then.getTime() + ms.months(1))
    }
  }, [year, month])

  return (
    <>
      <Link
        key={`previous_${year}_${month}`}
        href={isFullYear
          ? `/cal/${shiftModel}/${year - 1}`
          : `/cal/${shiftModel}/${lastMonth.year}/${lastMonth.month}`}
        class='inline-block px-4 py-3 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
        title={isFullYear ? 'voriges Jahr' : 'vorigen Monat'}
        aria-controls='calendar_main_out'
      >
        {'<'}
      </Link>

      <Link
        href={`/cal/${shiftModel}/${today[0]}/${String(today[1] + 1).padStart(2, '0')}`}
        class='inline-block px-4 py-3 text-white bg-transparent hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
        title='zeige aktuellen Monat'
        onClick={onClick}
      >
        Heute
      </Link>

      <Link
        key={`next_${year}_${month}`}
        href={isFullYear
          ? `/cal/${shiftModel}/${year + 1}`
          : `/cal/${shiftModel}/${nextMonth.year}/${nextMonth.month}`}
        class='inline-block px-4 py-3 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
        title={isFullYear ? 'nächstes Jahr' : 'nächster Monat'}
        aria-controls='calendar_main_out'
      >
        {'>'}
      </Link>
    </>
  )
}

function getMonthObj (time) {
  const t = new Date(time)
  return {
    year: String(t.getFullYear()),
    month: String(t.getMonth() + 1).padStart(2, '0')
  }
}
