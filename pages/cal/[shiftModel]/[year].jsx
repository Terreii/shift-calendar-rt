/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Head from 'next/head'
import { useRouter } from 'next/router'
import { DateTime, Info } from 'luxon'

import Month from '../../../components/month'
import Downloader from '../../../components/download'
import Legend from '../../../components/legend'
import { useTodayZeroIndex } from '../../../hooks/time'
import { shiftModelText } from '../../../lib/constants'
import selectMonthData from '../../../lib/select-month-data'
import { parseNumber } from '../../../lib/utils'

import style from '../../../styles/calender.module.css'

export default function Year () {
  const router = useRouter()
  const today = useTodayZeroIndex()
  const shiftModel = router.query.shiftModel
  const year = parseNumber(router.query.year, null)
  const group = parseNumber(router.query.group, 0)

  if (year == null) {
    return <h2>{router.query.year} is not a valid year.</h2>
  }

  const monthsData = []
  for (let i = 0; i < 12; i++) {
    monthsData.push([year, i])
  }

  return (
    <main className={style.main}>
      <Head>
        <title>
          {`Jahr ${year} - ${shiftModelText[shiftModel]} - `}
          Schichtkalender für Bosch Reutlingen
        </title>
      </Head>

      <Legend />

      <div
        id='calendar_main_out'
        className={style.container}
        onClick={event => {
          const element = event.target.closest('[title]')
          if ((element?.title?.length ?? 0) > 0) {
            window.alert(element.title)
          }
        }}
        aria-live='polite'
      >
        {monthsData.map(([year, month]) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            today={today[0] === year && today[1] === month ? today : null}
            group={group}
          />
        ))}
      </div>

      <Downloader shiftModel={shiftModel} />
    </main>
  )
}

/**
 * Get the props for server side rendering.
 * @param {import('next').GetServerSidePropsContext} context Next SSR context.
 * @returns {import('next').GetServerSidePropsResult}
 */
export async function getServerSideProps (context) {
  const { year: yearStr } = context.query
  const year = parseInt(yearStr)

  let maxAge = 60

  const thisYear = new Date().getUTCFullYear()
  if (year > thisYear) { // if request is in the future and today is not displayed.
    maxAge = 60 * 60 * 24 // cache for a day
  } else if (year < thisYear) { // if request is in the past and today is not displayed.
    maxAge = 60 * 60 * 24 * 31 // cache for 7 days
  } else if (Info.features().zones) {
    // get the diff in seconds to the next shift start
    const now = DateTime.local().setZone('Europe/Berlin')
    context.res.setHeader('X-Server-Luxon-Time', now.toFormat("HH':'mm"))

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
