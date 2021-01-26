/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'

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
      <Header />
      <Component isFirstRender={isFirstRender} {...pageProps} />
      <InstallPrompt />
    </>
  )
}
