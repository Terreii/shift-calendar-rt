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

    // timeout for updating in the background and if the page is in focus.
    const now = new Date()
    const time = now.getTime()
    // The next hour
    now.setHours(now.getHours() + 1)
    now.setMinutes(0)
    now.setSeconds(0)
    const timeout = setTimeout(update, now.getTime() - time)

    window.addEventListener('focus', update)
    return () => {
      window.removeEventListener('focus', update)
      clearTimeout(timeout)
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

/**
 * Fix to update the today border and switching of months in the [shiftModel] page,
 * after a tab was unloaded and restored.
 * 
 * It does it by completely re-render the calendar's tables. By removing them and the add them back.
 * 
 * @returns {boolean}  If true, then the calendar should not be rendered.
 */
export function useUnloadedFix () {
  const [shouldRemoveCalendar, setRemoveCalendar] = useState(false)

  useEffect(() => {
    const today = getToday()
    const todayRows = Array.from(document.querySelectorAll('tr[data-interest="today"]'))

    if (todayRows.length === 0) {
      // there aren't any today rows visible, check if the current month is rendered,
      // and reload the calendar if so.
      const currentMonth = document.querySelector(`#month_${today[0]}-${today[1]}`)
      if (currentMonth != null) {
        setRemoveCalendar(true)
        return
      }
    }

    const dateStr = today.slice(0, 3).join('-')
    if (!todayRows.some(row => row.id === dateStr)) {
      // none of the today rows had the current date. So the calendar must be re-rendered.
      setRemoveCalendar(true)
    }
  }, [])

  useEffect(() => {
    if (shouldRemoveCalendar) {
      // restore the calendar after it was removed
      const cancel = requestAnimationFrame(() => {
        setRemoveCalendar(false)
      })
      return () => {
        cancelAnimationFrame(cancel)
      }
    }
  }, [shouldRemoveCalendar])

  return shouldRemoveCalendar
}
