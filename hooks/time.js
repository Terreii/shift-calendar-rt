/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useMemo } from 'react'

import { getToday } from '../lib/utils'

export function useToday () {
  const [today, setToday] = useState(getToday)

  useEffect(() => {
    const update = () => {
      const nextToday = getToday()
      if (nextToday.some((v, i) => v !== today[i])) {
        setToday(nextToday)
      }
    }

    window.addEventListener('focus', update)
    return () => {
      window.removeEventListener('focus', update)
    }
  }, [today])

  return today
}

/**
 * Today, but the month is zero indexed.
 */
export function useTodayZeroIndex () {
  const today = useToday()

  // useMemo is more performant, because this hook is used in the month component.
  return useMemo(() => {
    const result = [...today]
    result[1] -= 1
    return result
  }, [today])
}
