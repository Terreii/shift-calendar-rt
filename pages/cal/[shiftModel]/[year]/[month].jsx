/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ms from 'milliseconds'

import Month from '../../../../components/month'
import Downloader from '../../../../components/download'
import Footer from '../../../../components/footer'
import { useTodayZeroIndex } from '../../../../hooks/time'
import { shiftModelNames, shiftModelNumberOfGroups } from '../../../../lib/constants'
import selectMonthData from '../../../../lib/select-month-data'
import { getIsSSR, getCalUrl, parseNumber, scrollToADay } from '../../../../lib/utils'

const tableClassNames = [
  'hidden 2xl:table',
  '',
  'hidden md:table',
  'hidden xl:table'
]

export default function MonthPage (props) {
  const router = useRouter()
  const todayAr = useTodayZeroIndex()
  const today = getIsSSR() ? [1999, 0, 1, 0] : todayAr
  const shiftModel = router.query.shiftModel
  const year = parseNumber(router.query.year, null)
  const monthQuery = parseNumber(router.query.month, null)
  const month = monthQuery ? monthQuery - 1 : monthQuery
  const group = parseNumber(router.query.group, 0)
  const search = parseNumber(router.query.search, null)
  const ref = useHammer(year, month, shiftModel, group)

  useEffect(() => {
    if (search) {
      scrollToADay(year, month, search)
    }
  }, [search])

  if (year == null) {
    return <h2>{router.query.year} is not a valid year.</h2>
  }
  if (month == null || month < 0 || month > 11) {
    return <h2>{router.query.month} is not a valid month.</h2>
  }

  const monthsData = []
  for (let i = 0; i < 4; ++i) {
    let monthNr = month + (i - 1)
    let yearNr = year

    if (search && monthNr === month && yearNr === year) {
      monthsData.push([year, month, search])
      continue
    }

    if (monthNr > 11) {
      monthNr -= 12
      yearNr += 1
    } else if (monthNr < 0) {
      monthNr += 12
      yearNr -= 1
    }

    monthsData.push([yearNr, monthNr])
  }

  return (
    <main className='flex flex-col content-center'>
      <div
        id='calendar_main_out'
        className='flex flex-row flex-wrap justify-around px-5 pt-16 pb-2'
        onClick={event => {
          const element = event.target.closest('[title]')
          if ((element?.title?.length ?? 0) > 0) {
            window.alert(element.title)
          }
        }}
        ref={ref}
        aria-live='polite'
      >
        {monthsData.map(([year, month, search], index) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            className={tableClassNames[index]}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            today={today[0] === year && today[1] === month ? today : null}
            search={search != null ? +search : null}
            group={group}
          />
        ))}
      </div>

      <Downloader shiftModel={shiftModel} />

      <Footer />
    </main>
  )
}

export async function getStaticPaths () {
  const now = new Date()
  const months = [
    now,
    new Date(now.getTime() - ms.months(1)), // last month
    new Date(now.getTime() + ms.months(1)), // next month
    new Date(now.getTime() + ms.months(2)), // after next month
  ]
    .map(date => ({
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1).padStart(2, '0')
    }))

  const paths = []

  for (const shiftModel of shiftModelNames) {
    // renders 0 (all group) and each group (1 to max), thats why the <= is there.
    for (let i = 0, max = shiftModelNumberOfGroups[shiftModel]; i <= max; i++) {
      const group = String(i)

      for (const date of months) {
        paths.push({
          params: {
            ...date,
            shiftModel,
            group
          }
        })
      }
    }
  }

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps (props) {
  return {
    props: {
      ...props,
      locales: null,
      locale: null,
      defaultLocale: null
    }
  }
}

/**
 * Setup Hammer and handle swipes.
 * @param {number}   year        The current year.
 * @param {number}   month       The current month.
 * @param {string}   shiftModel  Selected shift-model.
 * @param {number}   group       Shift group.
 */
function useHammer (year, month, shiftModel, group) {
  const [container, setContainer] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (container == null) return
    let isActive = true

    const handler = event => {
      switch (event.direction) {
        case 2: // right to left
        {
          const time = new Date()
          time.setMonth(month)
          time.setFullYear(year)
          time.setTime(time.getTime() + ms.months(1))

          router.push(getCalUrl({
            group,
            shiftModel,
            isFullYear: false,
            year: time.getFullYear(),
            month: time.getMonth() + 1
          }))
          break
        }

        case 4: // left to right
        {
          const time = new Date()
          time.setMonth(month)
          time.setFullYear(year)
          time.setTime(time.getTime() - ms.months(1))

          router.push(getCalUrl({
            group,
            shiftModel,
            isFullYear: false,
            year: time.getFullYear(),
            month: time.getMonth() + 1
          }))
          break
        }

        default: break
      }
    }

    let hammertime
    import('hammerjs').then(({ default: Hammer }) => {
      if (isActive) {
        hammertime = new Hammer(container)
        hammertime.on('swipe', handler)
      }
    })
    return () => {
      isActive = false
      if (hammertime) {
        hammertime.off('swipe', handler)
      }
    }
  }, [year, month, shiftModel, group, container])

  return setContainer
}
