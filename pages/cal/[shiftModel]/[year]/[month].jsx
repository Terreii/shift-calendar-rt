/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ms from 'milliseconds'
import { DateTime, Info } from 'luxon'

import Month from '../../../../components/month'
import Downloader from '../../../../components/download'
import Footer from '../../../../components/footer'
import Head from '../../../../components/head'
import { useTodayZeroIndex } from '../../../../hooks/time'
import {
  shiftModelNames,
  shiftModelNumberOfGroups,
  shiftModelText
} from '../../../../lib/constants'
import selectMonthData from '../../../../lib/select-month-data'
import { getCalUrl, parseNumber, scrollToADay } from '../../../../lib/utils'

const tableClassNames = [
  'hidden 2xl:table',
  '',
  'hidden md:table',
  'hidden xl:table'
]

export default function MonthPage (props) {
  const router = useRouter()
  const today = useTodayZeroIndex()
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
      <Head
        title={`Monat ${
          today[0]
        }-${
          String(today[1] + 1).padStart(2, '0')
        } - ${
          shiftModelText[shiftModel]
        }`}
      />
      <div
        id='calendar_main_out'
        className='flex flex-col justify-around gap-6 px-5 pt-16 pb-2 mx-auto md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
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

/**
 * Get the props for server side rendering.
 * @param {import('next').GetServerSidePropsContext} context Next SSR context.
 * @returns {import('next').GetServerSidePropsResult}
 */
export async function getServerSideProps (context) {
  const { year, month } = context.query

  const date = DateTime.fromObject({
    year: parseInt(year),
    month: parseInt(month, 10),
    zone: 'Europe/Berlin'
  })

  let maxAge = 60

  const monthsDiff = date.diffNow('months').toObject().months
  if (monthsDiff > 1) { // if request is in the future and today is not displayed.
    maxAge = 60 * 60 * 24 // cache for a day
  } else if (monthsDiff < -3) { // if request is in the past and today is not displayed.
    maxAge = 60 * 60 * 24 * 7 // cache for 7 days
  } else if (Info.features().zones) {
    // get the diff in seconds to the next shift start
    const now = DateTime.local().setZone('Europe/Berlin')

    let hour = 6 // get next shift start
    if (now.hour >= 22) {
      hour = 6
    } else if (now.hour >= 14) {
      hour = 22
    } else if (now.hour >= 6) {
      hour = 14
    }

    let nextShift = now.set({
      hour,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    if (nextShift.diff(now, 'minutes').toObject().minutes < 0) {
      nextShift = nextShift.plus({ days: 1 })
    }
    maxAge = nextShift.diff(now, 'seconds').toObject().seconds
  }

  context.res.setHeader('Cache-Control', 's-maxage=' + maxAge)
  return {
    props: context.query
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
