/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import style from './style.less'

import iosShare from '../../assets/icons/ios-share.png'
import iosAddToHome from '../../assets/icons/ios-add-to-home-screen.png'
import closeIcon from '../../assets/icons/close.svg'

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
        return <div class={style.Container}>
          <button class={style.Button} onClick={this._onClickInstallButton}>
            + zum Home Screen hinzufügen
          </button>
        </div>

      case 'ios':
        return <div class={style.IosContainer}>
          <div class={style.IosInstallInfo}>
            Klicke auf Teilen & dann "Zum Home-Bildschirm" um den Kalender zum installieren:
            <div class={style.IconsRow}>
              <img src={iosShare} height='55' alt='klicke Teilen' />
              ➡︎
              <img src={iosAddToHome} height='65' alt='klicke Zum Home-Bildschirm' />
            </div>
            <button class={style.Dismiss} onClick={this._dismiss} aria-label='schließe Meldung'>
              <img src={closeIcon} height='40' width='40' alt='' />
            </button>
          </div>
        </div>

      case 'none':
      default:
        return null
    }
  }
}