/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useRef } from 'react'
import ms from 'milliseconds'

import Confirm from './confirm'

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

  useEffect(() => {
    // Handling updates
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox != null) {
      const wb = window.workbox

      const promptNewVersionAvailable = event => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated
        // service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is
        // still waiting.

        // Ask for reloading
        setShow('update')
      }

      wb.addEventListener('waiting', promptNewVersionAvailable)
      wb.addEventListener('externalwaiting', promptNewVersionAvailable)
    }
  }, [])

  const onClickInstallButton = () => {
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

  const dismiss = () => {
    window.localStorage.setItem('dismissedInstallMessage', new Date().toJSON())
    setShow('none')
  }

  switch (show) {
    case 'popup':
      return (
        <Confirm
          confirmText={(
            <>
              <img
                src='/assets/icons/add-outline.svg'
                className='hue-invert'
                height='25'
                width='25'
                alt=''
              />
              <span className='my-1 ml-2'>Installieren</span>
            </>
          )}
          onClick={confirmed => {
            if (confirmed) {
              onClickInstallButton()
            } else {
              dismiss()
            }
          }}
        >
          <p>
            Dieser Kalender kann wie eine <em>App installiert</em> werden!
            <br />
            <br />
            Klicke auf <strong>Installieren</strong> um ihn bei deinen Apps zu speichern.
            Mit <strong>Abbrechen</strong> wirst du für 12 Tage nicht mehr danach gefragt.
          </p>
        </Confirm>
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

    case 'update':
      return (
        <Confirm
          confirmText='Neu laden'
          onClick={confirmed => {
            if (confirmed && window.workbox) {
              const wb = window.workbox
              wb.addEventListener('controlling', event => {
                window.location.reload()
              })

              // Send a message to the waiting service worker, instructing it to activate.
              wb.messageSW({ type: 'SKIP_WAITING' })
            }
            setShow('none')
          }}
        >
          <p>
            Eine neue Version der Kalender-App ist bereit.
            <br />
            Neu laden um das Update zu aktivieren?
          </p>
        </Confirm>
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
