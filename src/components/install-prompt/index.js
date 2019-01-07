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
      show: false
    }

    this.deferredPrompt = null
    this.boundOnClick = this._onClick.bind(this)

    /**
     * Event from the browser, that the Web-App can be installed.
     */
    window.addEventListener('beforeinstallprompt', event => {
      // for Chrome 67 and earlier
      event.preventDefault()

      // Stash the event so it can be triggered later.
      this.deferredPrompt = event

      this.setState({ show: true })
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.show !== this.state.show
  }

  /**
   * Event handler for when the user did click the button.
   * @param {Object} event Click event.
   */
  _onClick (event) {
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
    if (!this.state.show) return null

    return <div class={style.Container}>
      <button class={style.Button} onClick={this.boundOnClick}>
        + zum Home Screen hinzufügen
      </button>
    </div>
  }
}
