/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import style from './style.less'

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

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    const isInStandaloneMode = 'standalone' in window.navigator && window.navigator.standalone
    if (isIos && !isInStandaloneMode) {
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
  _onClickInstallButton = (event) => {
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
    })
  }

  /**
   * Render the Prompt
   * @returns {?JSX.Element}
   */
  render () {
    switch (this.state.show) {
      case 'button':
        return <div class={style.Container}>
          <button class={style.Button} onClick={this._onClickInstallButton}>
            + zum Home Screen hinzufügen
          </button>
        </div>

      case 'ios':
        return <div class={style.Container}>
          iOS
        </div>

      case 'none':
      default:
        return null
    }
  }
}
