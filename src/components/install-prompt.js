/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from '../web_modules/preact.js'

/**
 * Renders an install button for add-to-home-screen of PWA.
 */
export default class InstallButton extends Component {
  constructor (args) {
    super(args)

    this.state = {
      show: 'none'
    }

    this.deferredPrompt = null

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.platform)
    const isInStandaloneMode = 'standalone' in window.navigator && window.navigator.standalone
    const dismissedTime = new Date(window.localStorage.getItem('dismissedInstallMessage')).getTime()

    if (isIos && !isInStandaloneMode && dismissedTime < (Date.now() - 12 * 24 * 60 * 60 * 1000)) {
      this.state.show = 'ios'
    }

    /**
     * Event from the browser, that the Web-App can be installed.
     */
    window.addEventListener('beforeinstallprompt', event => {
      // for Chrome 67 and earlier
      event.preventDefault()

      // Stash the event so it can be triggered later.
      this.deferredPrompt = event

      this.setState({ show: 'button' })
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.show !== this.state.show
  }

  /**
   * Event handler for when the user did click the button.
   * @param {Object} event Click event.
   */
  _onClickInstallButton = event => {
    this.setState({ show: false })

    if (this.deferredPrompt == null) return

    // Show the prompt
    this.deferredPrompt.prompt()

    // Install
    this.deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
      } else {
        console.log('User dismissed the A2HS prompt')
      }

      this.deferredPrompt = null
      this.setState({ show: 'none' })
    })
  }

  /**
   * Dismiss the install message. It will not be shown again!
   * @param {Object} event Click event from the button
   */
  _dismiss = event => {
    window.localStorage.setItem('dismissedInstallMessage', new Date().toJSON())
    this.setState({ show: 'none' })
  }

  /**
   * Render the Prompt
   * @returns {?JSX.Element}
   */
  render () {
    switch (this.state.show) {
      case 'button':
        return <div class='text-base h-12 mb-safe-area'>
          <button
            class={'fixed bottom-0 left-0 w-screen bg-green-900 shadow-lg text-white ' +
              'hover:bg-green-700 focus:bg-green-700 focus:shadow-outline'}
            onClick={this._onClickInstallButton}
          >
            + zum Home Screen hinzufügen
          </button>
        </div>

      case 'ios':
        return <div
          class={'fixed bottom-0 w-screen flex flex-col items-center text-base text-white ' +
            'text-center bg-green-900 shadow-lg mb-safe-area'}
        >
          Klicke auf Teilen & dann "Zum Home-Bildschirm" um den Kalender zum installieren:
          <div class='flex flex-row items-center'>
            <img src='/assets/icons/ios-share.png' height='55' class='h-12' alt='klicke Teilen' />
            ➡︎
            <img
              src='/assets/icons/ios-add-to-home-screen.png'
              height='65'
              class='h-16'
              alt='klicke Zum Home-Bildschirm'
            />
          </div>
          <button
            class='ml-1 absolute bottom-0 right-0 bg-transparent border-0'
            onClick={this._dismiss}
            aria-label='schließe Meldung'
          >
            <img src='/assets/icons/close.svg' height='40' width='40' alt='' />
          </button>
        </div>

      case 'none':
      default:
        return null
    }
  }
}
