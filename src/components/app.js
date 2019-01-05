/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import { Router } from 'preact-router'
import Hammer from 'hammerjs'

import Header from './header'
import Main from './main'
import Impressum from './impressum'
import InstallPrompt from './install-prompt'

export default class App extends Component {
  constructor (args) {
    super(args)

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    this.state = {
      displayOption: '1', // display mode for months: '1'|'4'
      fullYear: false, // should the full year be displayed
      is64Model: false, // is it the 6-4 model or the 6-6 model?
      today: [year, month, now.getDate()], // Today
      year, // Selected year
      month // Selected month
    }

    this._onResize({})

    this._boundMonthChange = this._onChangeMonth.bind(this)
  }

  componentDidMount () {
    this.focusListener = this._onFocus.bind(this)
    this.resizeListener = this._onResize.bind(this)
    window.addEventListener('focus', this.focusListener)
    window.addEventListener('resize', this.resizeListener)

    // Setup Hammer.js - The touch event handler.
    this.hammertime = new Hammer(document.getElementById('app'))
    this.swipeListener = this._onSwipe.bind(this)
    this.hammertime.on('swipe', this.swipeListener)
  }

  componentWillUnmount () {
    window.removeEventListener('focus', this.focusListener)
    window.removeEventListener('resize', this.resizeListener)

    this.hammertime.off('swipe', this.swipeListener)
  }

  /**
   * If the tab gets focus again.
   * @param {Object} event  Focus-event from the browser.
   */
  _onFocus (event) {
    const now = new Date()
    const today = now.getDate()

    // update today marker on refocus
    if (this.state.today[2] !== today) {
      this.setState({
        today: [now.getFullYear(), now.getMonth(), today]
      })
    }
  }

  /**
   * If the Browser-window gets resized.
   * @param {Object} event  resize-event from the browser.
   */
  _onResize (event) {
    const displayOption = window.innerWidth < 1220 ? '1' : '4'

    if (displayOption !== this.state.displayOption) {
      this.setState({ displayOption })
    }
  }

  /**
   * Handles the month-change events from the header.
   * @param {Object} arg0             Containing other data. Has relative or year and month.
   * @param {number} [arg0.year]      Year of the next month to display.
   * @param {number} [arg0.month]     Month number in the year, of the next month to display.
   * @param {number} [arg0.relative]  Relative move to the active month.
   */
  _onChangeMonth ({ year = this.state.year, month = this.state.month, relative }) {
    if (typeof relative === 'number') {
      let nextMonth = this.state.month + relative
      let nextYear = this.state.year

      if (nextMonth < 0) {
        nextYear -= 1
        nextMonth += 12
      } else if (nextMonth >= 12) {
        nextYear += 1
        nextMonth -= 12
      }

      this.setState({
        year: nextYear,
        month: nextMonth
      })
    } else {
      this.setState({ year, month })
    }
  }

  /**
   * Handle swipe events.
   * @param {Object} event            "change" event from hammerjs.
   * @param {number} event.direction  direction of the swipe
   */
  _onSwipe (event) {
    switch (event.direction) {
      case 2: // right to left
        this._onChangeMonth({ relative: 1 })
        break

      case 4: // left to right
        this._onChangeMonth({ relative: -1 })
        break

      default:
        break
    }
  }

  /**
   * Gets fired when the route changes.
   * @param {Object} event     "change" event from [preact-router](http://git.io/preact-router)
   * @param {string} event.url The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url
  }

  render () {
    return (
      <div id='app'>
        <Header
          year={this.state.year}
          month={this.state.month}
          onChange={this._boundMonthChange}
        />
        <Router onChange={this.handleRoute}>
          <Main
            path='/'
            displayOption={this.state.fullYear ? 'full' : this.state.displayOption}
            year={this.state.year}
            month={this.state.month}
            is64Model={this.state.is64Model}
            today={this.state.today}
          />
          <Impressum path='/impressum/' />
        </Router>
        <InstallPrompt />
      </div>
    )
  }
}
