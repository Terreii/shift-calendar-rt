/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'querystringify'

import { shiftModelNames, shiftModelText } from '../lib/constants'
import { getCalUrl, getTodayUrl } from '../lib/utils'

import hamburgerIcon from '../public/assets/icons/hamburger_icon.svg'
import style from '../styles/layout.module.css'

export default function Index ({ isFirstRender = false }) {
  const router = useRouter()
  const [didCheckSettings, setDidCheckSettings] = useState(false)

  useEffect(() => {
    if (isFirstRender) {
      const settings = JSON.parse(window.localStorage.getItem('settings')) ?? {}

      if (window.location.hash.length > 1) { // parse the old share hash.
        const hashSettings = qs.parse(window.location.hash.slice(1))

        const date = hashSettings.search != null && hashSettings.search.length >= 8
          ? new Date(hashSettings.search)
          : new Date()

        router.replace(getCalUrl({
          isFullYear: false,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          shiftModel: hashSettings.shiftModel,
          group: hashSettings.group
        }))
      } else if (settings.didSelectModel) {
        // If the user did select their shift model, then display it.
        const now = new Date()

        router.replace(getTodayUrl({
          today: [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
          ],
          shiftModel: settings.shiftModel,
          group: settings.group
        }))
      } else {
        setDidCheckSettings(true)
      }
    }
  }, [isFirstRender, router])

  if (!didCheckSettings && router.asPath.endsWith('?pwa')) {
    return <main className={style.main} />
  }

  return (
    <main className={style.main}>
      <Head>
        <title>Schichtkalender für Bosch Reutlingen</title>
      </Head>

      <div id='calendar_main_out'>
        <h2>Willkommen zum inoffiziellen Schichtkalender für Bosch Reutlingen!</h2>

        <div>
          Welches Schichtmodell interessiert sie?
          <br />
          Sie können das Modell später jederzeit im{' '}
          <span className={style.no_break}>
            Menü
            <Image
              className={style.inline_menu_icon}
              src={hamburgerIcon}
              height='20'
              width='20'
              alt='das Menü ist oben rechts'
            />
          </span>
          umändern.
        </div>

        <ul className={style.shift_button_list}>
          {shiftModelNames.map(name => (
            <li key={name}>
              <Link href={`/cal/${name}`}>
                <a className={style.shift_button}>
                  {shiftModelText[name]}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
