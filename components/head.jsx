/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import Head from 'next/head'

export default function HeadComponent ({ title, children }) {
  return (
    <Head>
      <title>{title ? title + ' - ' : ''}Schichtkalender für Bosch Reutlingen</title>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, minimal-ui, viewport-fit=cover'
      />
      <meta
        name='description'
        content='Inoffizieller Schichtkalender für Bosch Reutlingen. Listet alle Kontischichten von Bosch Reutlingen auf.'
      />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Schichtkalender' />
      <meta name='application-name' content='Inoffizieller Schichtkalender für Bosch Reutlingen' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='theme-color' content='#006249' />
      <meta name='msapplication-TileColor' content='#006249' />
      <meta name='msapplication-TileImage' content='/assets/icons/mstile-150x150.png' />
      <link rel='apple-touch-icon' sizes='180x180' href='/assets/icons/apple-touch-icon.png' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='icon' type='image/png' href='/assets/icons/favicon-32x32.png' sizes='32x32' />
      <link rel='icon' type='image/png' href='/assets/icons/favicon-16x16.png' sizes='16x16' />
      <link rel='manifest' href='/manifest.webmanifest' />
      {children}
    </Head>
  )
}
