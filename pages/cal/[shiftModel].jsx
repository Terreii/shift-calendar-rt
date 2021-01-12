/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { getToday, getCalUrl } from '../../lib/utils'

export default function ShiftModel () {
  const router = useRouter()

  useEffect(() => {
    const today = getToday()
    router.replace(getCalUrl({
      isFullYear: false,
      group: router.query.group || 0,
      shiftModel: router.query.shiftModel,
      year: today[0],
      month: today[1],
    }))
  })
  
  return null
}
