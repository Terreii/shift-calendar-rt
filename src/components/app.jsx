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
import useStateReducer from '../lib/state'

import { shiftModelNames } from '../lib/constants'

/**
 * The App main component
 * @returns {JSX.Element}
 */
export default function App () {
  const [state, dispatch] = useStateReducer()
  const [isFirstRenderedPage, setIsFirstRenderedPage] = useState(true)

  const today = useToday()

  useEffect(() => {
    // on first render, and every time the shift model changes.
    if (state.didSelectModel) {
      const now = new Date()
      scrollToADay(now.getFullYear(), now.getMonth(), now.getDate())
    }
  }, [state.shiftModel, state.didSelectModel])

  return (
    <div id='app'>
      <Header
        shiftModel={state.shiftModel}
        search={state.search}
        group={state.group}
        url={state.url}
        today={today}
      />
      <Router
        onChange={event => {
          setIsFirstRenderedPage(false)

          if (event.url.length > 5 && event.url.startsWith('/cal/')) {
            const { group, shiftModel, search } = event.current.props.matches
            dispatch({
              type: 'change',
              payload: {
                url: event.url,
                search: search ? parseInt(search, 10) : null,
                group,
                shiftModel
              }
            })
          } else {
            dispatch({ type: 'url_change', url: event.url })
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
