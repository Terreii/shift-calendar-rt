/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Router, route } from 'preact-router'
import AsyncRoute from 'preact-async-route'

import FirstRunDialog from './first-run'
import Header from './header'
import InstallPrompt from './install-prompt'

import { scrollToADay, getCalUrl } from '../lib/utils'

import { shiftModelNames, shift66Name } from '../lib/constants'

/**
 * The App main component
 * @returns {JSX.Element}
 */
export default function App () {
  const [isFirstRenderedPage, setIsFirstRenderedPage] = useState(true)

  const [url, setUrl] = useState(() => window.location.pathname)
  const [shiftModel, setShiftModel] = useState(shift66Name)
  const [isFullYear, setIsFullYear] = useState(false)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  // group to display; 0 = all, 1 - 6 is group number
  const [group, setGroup] = useState(0)
  // Searched day. Only stores the day in month. year and month store the rest.
  const [search, setSearch] = useState(null)
  // did the user select a shift-model once?
  const [didSelectModel, setDidSelectModel] = useState(false)

  const today = useToday()

  useEffect(() => {
    if (didSelectModel) {
      window.localStorage.setItem('settings', JSON.stringify({
        didSelectModel: didSelectModel,
        group: group,
        shiftModel: shiftModel
      }))
    }
  }, [didSelectModel, group, shiftModel])

  useEffect(() => {
    // on first render, and every time the shift model changes.
    if (didSelectModel) {
      const now = new Date()
      scrollToADay(now.getFullYear(), now.getMonth(), now.getDate())
    }
  }, [shiftModel, didSelectModel])

  return (
    <div id='app'>
      <Header
        shiftModel={shiftModel}
        isFullYear={isFullYear}
        year={year}
        month={month}
        search={search}
        group={group}
        url={url}
        today={today}
      />
      <Router
        onChange={event => {
          setIsFirstRenderedPage(false)
          setUrl(event.url)

          if (event.url.length > 5 && event.url.startsWith('/cal/')) {
            const {
              year,
              month = '0',
              group = '0',
              shiftModel = shift66Name,
              search = null
            } = event.current.props.matches

            setDidSelectModel(true)
            setYear(parseInt(year, 10) || new Date().getFullYear())

            const parsedMonth = parseInt(month, 10)
            if (parsedMonth > 0) {
              setMonth(parsedMonth)
              setIsFullYear(false)
            } else {
              setIsFullYear(false)
            }

            setGroup(parseInt(group, 10) || 0)
            if (shiftModelNames.includes(shiftModel)) {
              setShiftModel(shiftModel)
            }
            setSearch(search == null ? null : (parseInt(search, 10) || null))
          }
        }}
      >
        <FirstRunDialog path='/' isFirstRender={isFirstRenderedPage} />
        <Redirect path='/cal' to='/' replace />
        <ModelRedirect path='/cal/:shiftModel' />
        <AsyncRoute
          path='/cal/:shiftModel/:year'
          getComponent={() => import('./main').then(m => m.default)}
          isFullYear
          today={today}
        />
        <AsyncRoute
          path='/cal/:shiftModel/:year/:month'
          getComponent={() => import('./main').then(m => m.default)}
          isFullYear={false}
          today={today}
        />
        <AsyncRoute
          path='/impressum'
          getComponent={() => import('./impressum').then(m => m.default)}
        />
      </Router>

      <InstallPrompt />
    </div>
  )
}

/**
 * Get today as a array of [year, month, day, hours].
 * @returns {[number, number, number, number]} Today-array
 */
function useToday () {
  const [today, setToday] = useState(() => {
    const now = new Date()
    return [now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()]
  })

  useEffect(() => {
    const onFocus = () => {
      const now = new Date()
      const nextToday = [now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()]
      if (nextToday.some((n, index) => n !== today[index])) {
        setToday(nextToday)
      }
    }

    const nextHour = new Date()
    nextHour.setHours(nextHour.getHours() + 1)
    nextHour.setMinutes(0)
    nextHour.setSeconds(0)

    const resetTimeout = setTimeout(() => {
      onFocus()
    }, Date.now() - nextHour.getTime())

    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      clearTimeout(resetTimeout)
    }
  }, [today])

  return today
}

function ModelRedirect ({ shiftModel, search, group }) {
  useEffect(() => {
    if (shiftModelNames.includes(shiftModel)) {
      const now = new Date()
      route(getCalUrl({
        search,
        group,
        shiftModel,
        isFullYear: false,
        year: now.getFullYear(),
        month: now.getMonth() + 1
      }), true)
    } else {
      route('/', true)
    }
  })
  return null
}

function Redirect ({ to, replace = false }) {
  useEffect(() => {
    route(to, replace)
  })
  return null
}
