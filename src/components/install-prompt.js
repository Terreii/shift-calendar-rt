/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { html, useState, useEffect, useRef } from '../preact.js'

/**
 * Renders an install button for add-to-home-screen of PWA.
 */
export default function InstallButton () {
  const [show, setShow] = useState('none')
  const deferredPrompt = useRef(null)

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.platform)
    const isInStandaloneMode = 'standalone' in window.navigator && window.navigator.standalone
    const dismissedTime = new Date(window.localStorage.getItem('dismissedInstallMessage'))
      .getTime()

    if (isIos && !isInStandaloneMode && dismissedTime < (Date.now() - 12 * 24 * 60 * 60 * 1000)) {
      setShow('ios')
    } else {
      const handler = event => {
        // for Chrome 67 and earlier
        event.preventDefault()

        // Stash the event so it can be triggered later.
        deferredPrompt.current = event

        setShow('button')
      }

      /**
       * Event from the browser, that the Web-App can be installed.
       */
      window.addEventListener('beforeinstallprompt', handler)
      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
      }
    }
  }, [])

  const onClickInstallButton = event => {
    setShow('none')

    if (deferredPrompt.current == null) return

    // Show the prompt
    deferredPrompt.current.prompt()

    // Install
    deferredPrompt.current.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
      } else {
        console.log('User dismissed the A2HS prompt')
      }

      deferredPrompt.current = null
      setShow('none')
    })
  }

  const dismiss = event => {
    window.localStorage.setItem('dismissedInstallMessage', new Date().toJSON())
    setShow('none')
  }

  switch (show) {
    case 'button':
      return html`
        <div class="text-base h-12 mb-safe-area">
          <button
            class=${'fixed bottom-0 left-0 w-screen bg-green-900 shadow-lg text-white ' +
              'hover:bg-green-700 focus:bg-green-700 focus:shadow-outline'}
            onClick=${onClickInstallButton}
          >
            + zum Home Screen hinzufügen
          </button>
        </div>
      `

    case 'ios':
      return html`
        <div
          class=${'fixed bottom-0 w-screen flex flex-col items-center text-base text-white ' +
            'text-center bg-green-900 shadow-lg mb-safe-area'}
        >
          Klicke auf Teilen & dann "Zum Home-Bildschirm" um den Kalender zum installieren:
          <div class="flex flex-row items-center">
            <img src="/assets/icons/ios-share.png" height="55" class="h-12" alt="klicke Teilen" />
            ➡︎
            <img
              src="/assets/icons/ios-add-to-home-screen.png"
              height="65"
              class="h-16"
              alt="klicke Zum Home-Bildschirm"
            />
          </div>
          <button
            class="ml-1 absolute bottom-0 right-0 bg-transparent border-0"
            onClick=${dismiss}
            aria-label="schließe Meldung"
          >
            <img src="/assets/icons/close.svg" height="40" width="40" alt="" />
          </button>
        </div>
      `

    case 'none':
    default:
      return null
  }
}
