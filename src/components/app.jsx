/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Router } from 'preact-router'
import Hammer from 'hammerjs'

import FirstRunDialog from './first-run.js'
import Header from './header.js'
import Impressum from './impressum.js'
import InstallPrompt from './install-prompt.js'
import Main from './main.js'

import { scrollToADay } from '../lib/utils.js'
import useStateReducer from '../lib/state'

/**
 * The App main component
 * @returns {JSX.Element}
 */
export default function App () {
  const [state, dispatch] = useStateReducer()

  const today = useToday()
  useHammer(dispatch, state.fullYear, state.url)

  useEffect(() => {
    // on first render, and every time the shift model changes.
    if (state.didSelectModel) {
      const now = new Date()
      scrollToADay(now.getFullYear(), now.getMonth(), now.getDate())
    }
  }, [state.shiftModel, state.didSelectModel])

  useEffect(() => {
    if (state.search) {
      scrollToADay(...state.search)
    }
  }, [state.search])

  return (
    <div id='app'>
      <Header
        year={state.year}
        month={state.month}
        isFullYear={state.fullYear}
        shiftModel={state.shiftModel}
        search={state.search}
        group={state.group}
        url={state.url}
        dispatch={dispatch}
      />
      <Router
        onChange={event => {
          dispatch({ type: 'url_change', url: event.url })
        }}
      >
        <Main
          path='/'
          isFullYear={state.fullYear}
          year={state.year}
          month={state.month}
          shiftModel={state.shiftModel}
          today={today}
          search={state.search}
          group={state.group}
        />
        <Impressum path='/impressum/' />
      </Router>

      <InstallPrompt />

      {state.didSelectModel
        ? null
        : (
          <FirstRunDialog
            onClick={model => {
              dispatch({
                type: 'model_change',
                payload: model
              })
            }}
          />
        )}
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

/**
 * Setup Hammer and handle swipes.
 * @param {function} dispatch   Dispatch function of the reducer.
 * @param {boolean}  isFullYear Is the full year displayed?
 * @param {string}   path       The URL path.
 */
function useHammer (dispatch, isFullYear, path) {
  useEffect(() => {
    if (isFullYear || path === '/impressum/') return

    const handler = event => {
      switch (event.direction) {
        case 2: // right to left
          dispatch({
            type: 'move',
            payload: 1
          })
          break

        case 4: // left to right
          dispatch({
            type: 'move',
            payload: -1
          })
          break
      }
    }

    const hammertime = new Hammer(document.getElementById('app'))
    hammertime.on('swipe', handler)
    return () => {
      hammertime.off('swipe', handler)
    }
  }, [isFullYear, path])
}
