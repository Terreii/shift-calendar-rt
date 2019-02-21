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
      numberOfMonths: 1, // display mode for months: 1|4
      fullYear: false, // should the full year be displayed
      is64Model: false, // is it the 6-4 model or the 6-6 model?
      today: [year, month, now.getDate()], // Today
      search: null,
      year, // Selected year
      month, // Selected month
      group: 0 // group to display; 0 = all, 1 - 6 is group number
    }

    this._onResize({})
  }

  componentDidMount () {
    this.focusListener = this._onFocus.bind(this)
    this.resizeListener = this._onResize.bind(this)
    window.addEventListener('focus', this.focusListener)
    window.addEventListener('resize', this.resizeListener)

    // Setup Hammer.js - The touch event handler.
    this.hammertime = new Hammer(document.getElementById('app'))
    this.hammertime.on('swipe', this._onSwipe)
  }

  componentWillUnmount () {
    window.removeEventListener('focus', this.focusListener)
    window.removeEventListener('resize', this.resizeListener)

    this.hammertime.off('swipe', this._onSwipe)
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
    const numberOfMonths = window.innerWidth < 1220 ? 1 : 4

    if (numberOfMonths !== this.state.numberOfMonths) {
      this.setState({ numberOfMonths })
    }
  }

  /**
   * Handles the month-change events from the header.
   * @param {Object} arg0             Containing other data. Has relative or year and month.
   * @param {number} [arg0.year]      Year of the next month to display.
   * @param {number} [arg0.month]     Month number in the year, of the next month to display.
   * @param {number} [arg0.relative]  Relative move to the active month.
   * @param {boolean} [arg0.toggleFullYear] Deactivate full year mode, if it is set.
   */
  _onChangeMonth = ({
    year = this.state.year,
    month = this.state.month,
    relative, toggleFullYear
  }) => {
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

    if (this.state.fullYear && toggleFullYear) {
      this.setState({ fullYear: false })
    }
  }

  /**
   * Search a day
   * @param {boolean} doSearch Switch into search mode.
   * @param {number} year Year of the searched day.
   * @param {number} month Month of the searched day.
   * @param {number} day Date in the month of the searched day.
   */
  _search = (doSearch, year, month, day) => {
    if (doSearch) {
      this._onChangeMonth({ year, month, toggleFullYear: true })
      this.setState({
        search: [year, month, day]
      })

      if (this.clearSearchScroll != null) {
        clearTimeout(this.clearSearchScroll)
      }

      this.clearSearchScroll = setTimeout(() => {
        const row = document.querySelector(`#month_${year}-${month + 1} tr:nth-child(${day})`)

        if (row != null && row.scrollIntoView != null) {
          row.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 16 * 4)
    } else {
      this.setState({
        search: null
      })
    }
  }

  /**
   * Handle swipe events.
   * @param {Object} event            "change" event from hammerjs.
   * @param {number} event.direction  direction of the swipe
   */
  _onSwipe = event => {
    if (this.state.fullYear) return

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
   * Toggle between showing the full year or the selected display option.
   */
  _toggleFullYear = () => {
    this.setState({
      fullYear: !this.state.fullYear
    })
  }

  /**
   * Change to display group.
   * @param {number} group number of group to display; 0 = all, 1 - 6 group number.
   */
  _changeGroup = group => {
    if (group < 0 || group > 6) return

    this.setState({ group })
  }

  /**
   * Gets fired when the route changes.
   * @param {Object} event     "change" event from [preact-router](http://git.io/preact-router)
   * @param {string} event.url The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url
  }

  /**
   * Renders the App with its routs
   * @returns {JSX.Element}
   */
  render () {
    return (
      <div id='app'>
        <Header
          year={this.state.year}
          month={this.state.month}
          isFullYear={this.state.fullYear}
          onChange={this._onChangeMonth}
          toggleFullYear={this._toggleFullYear}
          search={this._search}
          searchResult={this.state.search}
          group={this.state.group}
          onGroupChange={this._changeGroup}
        />
        <Router onChange={this.handleRoute}>
          <Main
            path='/'
            numberOfMonths={this.state.fullYear ? 12 : this.state.numberOfMonths}
            year={this.state.year}
            month={this.state.month}
            is64Model={this.state.is64Model}
            today={this.state.today}
            search={this.state.search}
            group={this.state.group}
          />
          <Impressum path='/impressum/' />
        </Router>
        <InstallPrompt />
      </div>
    )
  }
}
