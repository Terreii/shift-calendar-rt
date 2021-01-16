/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { shift66Name } from '../lib/constants'

/**
 * Get the stored or current month.
 * @returns {{
 *   url: string,
 *   isFullYear: boolean,
 *   year: number,
 *   month: number,
 *   shiftModel: string,
 *   group: number,
 *   search: number | null
 * }}
 */
export function useQueryProps () {
  const router = useRouter()

  const {
    asPath: url,
    query: {
      shiftModel,
      year: yearStr,
      month: monthStr,
      group: groupStr = '0',
      search: searchStr
    }
  } = router

  const year = parseInt(yearStr) || new Date().getFullYear()
  const isFullYear = !monthStr
  const month = isFullYear ? 1 : parseInt(monthStr)
  const group = parseInt(groupStr)
  const search = searchStr && !Number.isNaN(searchStr) ? parseInt(searchStr, 10) : null

  const [storedSettings, setStoredSettings] = useState({
    shiftModel: shiftModel ?? shift66Name,
    group: Number.isNaN(group) ? 0 : group
  })
  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem('settings')) ?? {}
    if (settings.didSelectModel) {
      setStoredSettings(old => {
        if (
          (settings.shiftModel != null && old.shiftModel !== settings.shiftModel) ||
          (settings.group != null && old.group !== settings.group)
        ) {
          return {
            shiftModel: settings.shiftModel,
            group: settings.group
          }
        }
        return old
      })
    }
  }, [url])

  return {
    url,
    isFullYear,
    year,
    month,
    shiftModel: shiftModel ?? storedSettings.shiftModel,
    group: Number.isNaN(group) ? storedSettings.group : group,
    search
  }
}
