/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useRouter } from 'next/router'
import ms from 'milliseconds'

import Main from '../../../../components/main'
import { useTodayZeroIndex } from '../../../../hooks/time'
import { shiftModelNames, shiftModelNumberOfGroups } from '../../../../lib/constants'
import { getIsSSR } from '../../../../lib/utils'

export default function Month (props) {
  const router = useRouter()
  const today = useTodayZeroIndex()
  const search = parseInt(router.query.search, 10)

  return <div>
    <Main
      isFullYear={false}
      year={parseInt(router.query.year, 10)}
      month={parseInt(router.query.month, 10)}
      shiftModel={router.query.shiftModel}
      today={getIsSSR() ? [1999, 0, 1, 0] : today}
      search={Number.isNaN(search) ? null : search}
      group={router.query.group}
    />
  </div>
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
