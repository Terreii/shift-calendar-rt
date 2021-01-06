/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { route, Link } from 'preact-router'
import qs from 'querystringify'

import Footer from './footer'
import { shiftModelNames, shiftModelText, shiftModelNumberOfGroups } from '../lib/constants'
import { isSSR } from '../lib/utils'

export default function FirstRun ({ isFirstRender = false }) {
  useEffect(() => {
    if (isFirstRender) {
      const storedSettings = JSON.parse(window.localStorage.getItem('settings') || '{}')

      // parse the old share hash.
      if (window.location.hash.length > 1) {
        const hashSettings = qs.parse(window.location.hash.slice(1))

        const group = +hashSettings.group
        if (!Number.isNaN(group) && group > 0 && group <= 6) {
          storedSettings.group = group
        }

        const schichtmodell = hashSettings.schichtmodell
        if (schichtmodell != null && shiftModelNames.includes(schichtmodell)) {
          storedSettings.didSelectModel = true
          storedSettings.shiftModel = schichtmodell

          if (storedSettings.group > shiftModelNumberOfGroups[schichtmodell]) {
            storedSettings.group = 0
          }
        }

        if (hashSettings.search != null && hashSettings.search.length >= 8) {
          const date = new Date(hashSettings.search)
          const year = date.getFullYear()
          const month = date.getMonth()
          const day = date.getDate()
          window.location.hash = ''

          const params = new URLSearchParams()
          if (storedSettings.group && storedSettings.group > 0) {
            params.set('group', storedSettings.group)
          }
          params.set('search', day)

          route(`/cal/${storedSettings.shiftModel}/${year}/${month}?${params.toString()}`)
          return
        }

        window.location.hash = ''
      }

      // move to today.
      // The Service Worker and web-manifest will load the calendar at `/`.
      // But most people will want to see their shifts in this month.
      // We move there, if they have they have selected their shift model.
      if (
        storedSettings.didSelectModel &&
        shiftModelNames.includes(storedSettings.shiftModel)
      ) {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const group = typeof storedSettings.group === 'number' && storedSettings.group > 0
          ? '?group=' + storedSettings.group
          : ''
        route(`/cal/${storedSettings.shiftModel}/${year}/${month}${group}`)
      }
    }
  }, [isFirstRender])

  if (!isSSR && isFirstRender) {
    return null
  }

  return (
    <main class='fixed top-0 pt-16 text-center w-screen h-screen bg-gray-100'>
      <h2>Willkommen zum inoffiziellen Schichtkalender für Bosch Reutlingen!</h2>

      <p>
        Welches Schichtmodell interessiert sie?
        <br />
        Sie können das Modell später jederzeit im Menü
        <img
          class='inline-block ml-1 mr-2'
          src='/assets/icons/hamburger_icon.svg'
          height='20'
          width='20'
          alt='das Menü ist oben rechts'
        />
        umändern.
      </p>

      <ul class='list-none flex flex-col justify-center w-64 mt-2 mb-16 mx-auto p-0 space-y-3'>
        {shiftModelNames.map(name => (
          <li key={name}>
            <Link
              class='inline-block mx-3 py-3 px-4 h-12 w-full border-0 bg-indigo-700 text-white text-center rounded shadow hover:bg-indigo-800 focus:bg-indigo-800 focus:ring focus:outline-none'
              href={`/cal/${name}`}
            >
              {shiftModelText[name]}
            </Link>
          </li>
        ))}
      </ul>

      <Footer />
    </main>
  )
}
