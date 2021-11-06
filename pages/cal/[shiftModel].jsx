/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DateTime, Info } from 'luxon'

import ByMonths from '../../components/by-month'
import Downloader from '../../components/download'
import Legend from '../../components/legend'
import { useTodayZeroIndex, useUnloadedFix } from '../../hooks/time'
import { shiftModelText } from '../../lib/constants'
import { parseNumber } from '../../lib/utils'

import style from '../../styles/calender.module.css'

/**
 * Route that always displays today.
 */
export default function ShiftModel () {
  const router = useRouter()
  const today = useTodayZeroIndex()
  const shiftModel = router.query.shiftModel
  const group = parseNumber(router.query.group, 0)
  const year = today[0]
  const month = today[1]

  const shouldRemoveCalendar = useUnloadedFix()
  if (shouldRemoveCalendar) {
    return null
  }

  return (
    <main className={style.main}>
      <Head>
        <title>
          {`Monat ${
            today[0]
          }-${
            String(today[1] + 1).padStart(2, '0')
          } - ${
            shiftModelText[shiftModel]
          } - `}
          Schichtkalender für Bosch Reutlingen
        </title>
      </Head>

      <Legend />

      <ByMonths
        shiftModel={shiftModel}
        group={group}
        search={null}
        year={year}
        month={month}
        today={today}
      />

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
  let maxAge = 60

  if (Info.features().zones) {
    // get the diff in seconds to the next shift start
    const now = DateTime.local().setZone('Europe/Berlin')
    context.res.setHeader('X-Server-Luxon-Time', now.toFormat("HH':'mm"))

    let hour = 6 // get next shift start
    if (now.hour >= 22) {
      hour = 0 // fixes the jump to the next month and moving the border.
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
  } else {
    context.res.setHeader('X-Server-Luxon-Time', 'No zones supported.')
  }

  context.res.setHeader('Cache-Control', 's-maxage=' + maxAge)
  return {
    props: context.query
  }
}
