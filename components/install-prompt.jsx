/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useRef } from 'react'
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
          setTimeout(setShow, ms.seconds(15), 'popup')
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
    case 'popup':
      return (
        <aside
          className='fixed bottom-0 left-0 flex flex-col w-full bg-gray-300 border-t border-gray-600 shadow-lg sm:border-t-0 sm:rounded sm:mb-2 sm:ml-2 sm:max-w-sm'
        >
          <p className='p-4'>
            Dieser Kalender kann wie eine <em>App installiert</em> werden!
            <br />
            <br />
            Klicke auf <strong>Installieren</strong> um ihn bei deinen Apps zu speichern.
            Mit <strong>Abbrechen</strong> wirst du für 12 Tage nicht mehr danach gefragt.
          </p>
          <div className='flex flex-row items-center justify-end m-3'>
            <button
              className='flex flex-row items-center justify-center w-32 px-2 py-1 mx-3 text-white bg-purple-700 shadow focus:ring focus:outline-none hover:bg-purple-600 focus:bg-purple-600 active:bg-purple-600 form-item'
              onClick={onClickInstallButton}
            >
              <img
                src='/assets/icons/add-outline.svg'
                className='hue-invert'
                height='25'
                width='25'
                alt=''
              />
              <span className='my-1 ml-2'>Installieren</span>
            </button>
            <button
              type='button'
              onClick={dismiss}
              title='Klicke um den Kalender nicht zu installieren'
              className='flex flex-col items-center justify-center w-32 px-2 py-1 mx-3 border-black rounded-br-lg shadow hover:bg-gray-200 focus:bg-gray-200 focus:ring focus:outline-none form-item'
            >
              Abbrechen
            </button>
          </div>
        </aside>
      )

    case 'ios':
      return (
        <div
          className='fixed bottom-0 flex flex-col items-center w-screen bg-gray-200 border-t border-gray-500 shadow-lg pb-safe-area'
        >
          <span className='my-1 text-sm text-center text-gray-900'>
            Klicke auf Teilen &amp; dann "Zum Home-Bildschirm" um den Kalender zu installieren:
          </span>
          <div className='flex flex-row items-stretch mb-1'>
            <img
              src='/assets/icons/ios-share.png'
              height='81'
              width='57'
              className='object-contain object-center w-16 h-16 p-1 bg-gray-300 border border-gray-500 rounded'
              alt='klicke Teilen'
            />
            <span className='block mx-3 my-auto'>➡︎</span>
            <img
              src='/assets/icons/ios-add-to-home-screen.png'
              height='283'
              width='190'
              className='object-contain object-center w-16 h-16 p-1 bg-gray-300 border border-gray-500 rounded'
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
      className='absolute bottom-0 right-0 ml-1 bg-transparent border-0'
      onClick={onClick}
      aria-label='schließe Meldung'
    >
      <img src='/assets/icons/close.svg' height='40' width='40' alt='' />
    </button>
  )
}
