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
      setTimeout(setShow, ms.seconds(15), 'ios')
    } else {
      const handler = event => {
        // for Chrome 67 and earlier
        event.preventDefault()

        // Stash the event so it can be triggered later.
        deferredPrompt.current = event

        if (dismissedTime < (Date.now() - ms.days(12))) {
          setTimeout(setShow, ms.seconds(15), 'button')
        }
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
        <aside
          class='fixed bottom-0 left-0 flex flex-row md:mb-2 md:ml-2 max-w-screen-sm md:max-w-sm bg-gray-200 text-base border rounded-t-lg md:rounded-lg border-gray-500 shadow pb-safe-area'
        >
          <p className='p-4'>
            Dieser Kalender kann wie eine <em>App installiert</em> werden!
            <em> Ohne auf deine Daten zugreifen zu können!</em>
            <br />
            Klicke auf installieren um ihn bei deinen Apps zu speichern.
          </p>
          <div className='flex flex-col border-l border-black'>
            <button
              className='flex flex-col items-center justify-center flex-grow px-2 py-1 text-black rounded-tr-lg hover:bg-gray-300 focus:bg-gray-400 focus:ring focus:outline-none'
              onClick={onClickInstallButton}
            >
              <img src='/assets/icons/add-outline.svg' height='30' width='30' alt='' />
              <span className='mt-1'>installieren</span>
            </button>
            <button
              type='button'
              onClick={dismiss}
              title='Klicke um den Kalender nicht zu installieren'
              className='flex flex-col items-center justify-center flex-grow px-2 py-1 border-t border-black rounded-br-lg hover:bg-gray-300 focus:bg-gray-400 focus:ring focus:outline-none'
            >
              Abbrechen
            </button>
          </div>
        </aside>
      )

    case 'ios':
      return (
        <div
          class='fixed bottom-0 w-screen flex flex-col items-center bg-gray-200 border-t border-gray-500 shadow-lg pb-safe-area'
        >
          <span class='text-sm text-gray-900 text-center my-1'>
            Klicke auf Teilen &amp; dann "Zum Home-Bildschirm" um den Kalender zu installieren:
          </span>
          <div class='flex flex-row items-stretch mb-1'>
            <img
              src='/assets/icons/ios-share.png'
              height='81'
              width='57'
              class='bg-gray-300 rounded object-contain object-center h-16 w-16 p-1 border border-gray-500'
              alt='klicke Teilen'
            />
            <span class='block my-auto mx-3'>➡︎</span>
            <img
              src='/assets/icons/ios-add-to-home-screen.png'
              height='283'
              width='190'
              class='bg-gray-300 rounded object-contain object-center h-16 w-16 p-1 border border-gray-500'
              alt='klicke Zum Home-Bildschirm'
            />
          </div>
          <CloseButton onClick={dismiss} />
        </div>
      )

    case 'none':
    default:
      return null
  }
}

function CloseButton ({ onClick }) {
  return (
    <button
      type='button'
      class='ml-1 absolute bottom-0 right-0 bg-transparent border-0'
      onClick={onClick}
      aria-label='schließe Meldung'
    >
      <img src='/assets/icons/close.svg' height='40' width='40' alt='' />
    </button>
  )
}
