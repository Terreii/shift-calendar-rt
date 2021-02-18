/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import PouchDB from 'pouchdb'
import memoryAdapter from 'pouchdb-adapter-memory'
import { useState, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import Head from 'next/head'
import { Provider } from 'use-pouchdb'

import Footer from '../components/footer'
import Header from '../components/header'
import InstallPrompt from '../components/install-prompt'
import configureStore from '../lib/store'
import { useCreateViews } from '../lib/views'
import { changed as dbChanged } from '../lib/reducers/db'
import 'modern-css-reset'
import '../styles/index.css'

PouchDB.plugin(memoryAdapter)

const store = configureStore()

export default function App ({ Component, pageProps }) {
  // Index page uses this to redirect on the first render.
  // But on later visits not.
  // If the user did select a shift model or there is a share hash, then index will redirect.
  const [isFirstRender, setIsFirstRender] = useState(true)
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  const [db, setDB] = useState(createDB)
  useEffect(() => {
    // Create a new DB when the old one gets destroyed.
    // A db will be destroyed when the user signs out.
    const listener = dbName => {
      if (dbName === 'local') {
        setDB(createDB())
      }
    }

    PouchDB.on('destroyed', listener)
    return () => {
      PouchDB.removeListener('destroyed', listener)
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && 'document' in window) {
      window.db = db
    }

    // update the db if it did change
    store.dispatch((dispatch, getState, extraArg) => {
      if (extraArg.db !== db) {
        extraArg.db = db
        dispatch(dbChanged())
      }
    })
  }, [db])

  useCreateViews(db)

  return (
    <>
      <Head>
        <title>Schichtkalender für Bosch Reutlingen</title>
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

      <Provider pouchdb={db}>
        <ReduxProvider store={store}>
          <Header />
          <Component isFirstRender={isFirstRender} {...pageProps} />
          <Footer />
          <InstallPrompt />
        </ReduxProvider>
      </Provider>
    </>
  )
}

/**
 * Creates the local db.
 */
function createDB () {
  try {
    if ('IDBDatabase' in window || 'localStorage' in window) {
      // in browser
      return new PouchDB('local', { auto_compaction: true })
    } else {
      // on server/node
      return new PouchDB('local', { adapter: 'memory' })
    }
  } catch (err) {
    // on server/node
    return new PouchDB('local', { adapter: 'memory' })
  }
}
