/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useRouter } from 'next/router'

import Month from '../../../components/month'
import Downloader from '../../../components/download'
import Footer from '../../../components/footer'
import { useTodayZeroIndex } from '../../../hooks/time'
import { shiftModelNames, shiftModelNumberOfGroups } from '../../../lib/constants'
import selectMonthData from '../../../lib/select-month-data'
import { getIsSSR, parseNumber } from '../../../lib/utils'

export default function Year () {
  const router = useRouter()
  const todayAr = useTodayZeroIndex()
  const today = getIsSSR() ? [1999, 0, 1, 0] : todayAr
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
    <main className='flex flex-col content-center'>
      <div
        id='calendar_main_out'
        className='flex flex-col justify-around gap-6 px-5 pt-16 pb-2 mx-auto md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
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

      <Footer />
    </main>
  )
}

export async function getStaticPaths () {
  const now = new Date().getFullYear()
  const years = [
    now,
    now - 1,
    now + 1
  ].map(String)

  const paths = []

  for (const shiftModel of shiftModelNames) {
    // renders 0 (all group) and each group (1 to max), thats why the <= is there.
    for (let i = 0, max = shiftModelNumberOfGroups[shiftModel]; i <= max; i++) {
      const group = String(i)

      for (const year of years) {
        paths.push({
          params: {
            year,
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
