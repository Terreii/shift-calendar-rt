/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import Head from 'next/head'

import Header from '../components/header'
import InstallPrompt from '../components/install-prompt'
import '../styles/index.css'

export default function MyApp ({ Component, pageProps }) {
  // Index page uses this to redirect on the first render.
  // But on later visits not.
  // If the user did select a shift model or there is a share hash, then index will redirect.
  const [isFirstRender, setIsFirstRender] = useState(true)
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  return (
    <>
      <Head>
        <title>Schichtkalender für Bosch Reutlingen</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no, minimal-ui, viewport-fit=cover'
        />
        <meta
          name='description'
          content='Inoffizieller Schichtkalender für Bosch Reutlingen. Listet alle Kontischichten von Bosch Reutlingen auf.'
        />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Schichtkalender' />
        <meta
          name='application-name'
          content='Inoffizieller Schichtkalender für Bosch Reutlingen'
        />
        <meta name='format-detection' content='telephone=no' />
        <meta name='theme-color' content='#064E3B' />
        <meta name='msapplication-TileColor' content='#064E3B' />
        <meta name='msapplication-TileImage' content='/assets/icons/mstile-150x150.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/assets/icons/apple-touch-icon.png' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' href='/assets/icons/favicon-32x32.png' sizes='32x32' />
        <link rel='icon' type='image/png' href='/assets/icons/favicon-16x16.png' sizes='16x16' />
        <link rel='manifest' href='/manifest.webmanifest' />
      </Head>

      <Header />
      <Component isFirstRender={isFirstRender} {...pageProps} />
      <InstallPrompt />
    </>
  )
}
