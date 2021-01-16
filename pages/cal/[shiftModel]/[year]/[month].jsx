/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useRouter } from 'next/router'

import Main from '../../../../components/main'
import { useTodayZeroIndex } from '../../../../hooks/time'

export default function Month () {
  const router = useRouter()
  const today = useTodayZeroIndex()
  const search = parseInt(router.query.search, 10)

  return <div>
    <Main
      isFullYear={false}
      year={parseInt(router.query.year, 10)}
      month={parseInt(router.query.month, 10)}
      shiftModel={router.query.shiftModel}
      today={today}
      search={Number.isNaN(search) ? null : search}
      group={router.query.group}
    />
  </div>
}
