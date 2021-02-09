/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useMemo } from 'react'
import ms from 'milliseconds'
import Link from 'next/link'

import { useToday } from '../hooks/time'
import { getCalUrl, getTodayUrl } from '../lib/utils'

import style from './header.module.css'

/**
 * Display 3 links to move in the calendar.
 * One button is move to today. And the other once are to move to the next/previous month/year.
 * @param {object}   param             Preact params.
 * @param {number}   param.year        Current active year.
 * @param {number}   param.month       Current active month.
 * @param {boolean}  param.isFullYear  Is the full year shown?
 * @param {string}   param.shiftModel  The current shift model.
 * @param {number}   param.group       Selected group to display. 0 = all, >= 1 only one.
 */
export default function HeaderNavLinks ({ year, month, isFullYear, shiftModel, group }) {
  const today = useToday()

  const { lastMonth, nextMonth } = useMemo(() => {
    if (isFullYear) {
      return {
        lastMonth: getCalUrl({
          group,
          shiftModel,
          isFullYear: true,
          year: year - 1,
          month: 1
        }),
        nextMonth: getCalUrl({
          group,
          shiftModel,
          isFullYear: true,
          year: year + 1,
          month: 1
        })
      }
    }

    const then = new Date()
    then.setFullYear(year)
    then.setMonth(month - 1)
    then.setDate(3)

    return {
      lastMonth: getMonthUrl(then.getTime() - ms.months(1), shiftModel, group),
      nextMonth: getMonthUrl(then.getTime() + ms.months(1), shiftModel, group)
    }
  }, [year, month, isFullYear, shiftModel, group])

  return (
    <>
      <Link key={`previous_${year}_${month}`} href={lastMonth}>
        <a
          className={style.navi_link}
          title={isFullYear ? 'voriges Jahr' : 'vorigen Monat'}
        >
          {'<'}
        </a>
      </Link>

      <Link href={getTodayUrl({ group, shiftModel, today })}>
        <a
          className={style.navi_link}
          title='zeige aktuellen Monat'
        >
          Heute
        </a>
      </Link>

      <Link key={`next_${year}_${month}`} href={nextMonth}>
        <a
          className={style.navi_link}
          title={isFullYear ? 'nächstes Jahr' : 'nächster Monat'}
        >
          {'>'}
        </a>
      </Link>
    </>
  )
}

function getMonthUrl (time, shiftModel, group) {
  const t = new Date(time)
  return getCalUrl({
    group,
    shiftModel,
    isFullYear: false,
    year: t.getFullYear(),
    month: t.getMonth() + 1
  })
}
