/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import ms from 'milliseconds'

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

    if (isIos && !isInStandaloneMode && dismissedTime < (Date.now() - ms.days(12))) {
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
      return (
        <div
          class={'fixed bottom-0 left-0 bg-gray-200 text-base border-t border-gray-500 py-1 ' +
          'shadow pb-safe-area'}
        >
          <button
            class={'flex flex-row justify-center items-center w-screen h-8 text-black ' +
            'hover:bg-green-700 focus:bg-green-700 focus:shadow-outline focus:outline-none'}
            onClick={onClickInstallButton}
          >
            <img src='/assets/icons/add-outline.svg' height='30' width='30' alt='' />
            <span class='ml-2'>zum Home Screen hinzufügen / installieren</span>
          </button>
        </div>
      )

    case 'ios':
      return (
        <div
          class={'fixed bottom-0 w-screen flex flex-col items-center bg-gray-200 border-t ' +
          'border-gray-500 shadow-lg pb-safe-area'}
        >
          <span class='text-sm text-gray-900 text-center my-1'>
            Klicke auf Teilen &amp; dann "Zum Home-Bildschirm" um den Kalender zum installieren:
          </span>
          <div class='flex flex-row items-stretch mb-1'>
            <img
              src='/assets/icons/ios-share.png'
              height='81'
              width='57'
              class='bg-gray-400 rounded object-contain object-center h-16 w-16 p-1 border border-gray-500'
              alt='klicke Teilen'
            />
            <span class='block my-auto mx-3'>➡︎</span>
            <img
              src='/assets/icons/ios-add-to-home-screen.png'
              height='283'
              width='190'
              class={'bg-gray-400 rounded object-contain object-center h-16 w-16 p-1 border ' +
              'border-gray-500'}
              alt='klicke Zum Home-Bildschirm'
            />
          </div>
          <button
            class='ml-1 absolute bottom-0 right-0 bg-transparent border-0'
            onClick={dismiss}
            aria-label='schließe Meldung'
          >
            <img src='/assets/icons/close.svg' height='40' width='40' alt='' />
          </button>
        </div>
      )

    case 'none':
    default:
      return null
  }
}
