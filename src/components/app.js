/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import { Router } from 'preact-router'
import Hammer from 'hammerjs'
import qs from 'querystringify'

import FirstRunDialog from './first-run.js'
import Header from './header.js'
import Impressum from './impressum.js'
import InstallPrompt from './install-prompt.js'
import Main from './main.js'

import {
  shiftModelNames,
  shift66Name,
  shiftModelNumberOfGroups
} from '../lib/constants'

export default class App extends Component {
  constructor (args) {
    super(args)

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    this.state = {
      url: window.location.pathname,
      didSelectModel: true, // did the user select a shift-model once?
      numberOfMonths: 1, // display mode for months: 1|4
      fullYear: false, // should the full year be displayed
      shiftModel: shift66Name, // Which shift-model is it, the 6-4 model or the 6-6 model?
      today: [year, month, now.getDate(), now.getHours()], // Today
      search: null,
      year, // Selected year
      month, // Selected month
      group: 0 // group to display; 0 = all, 1 - 6 is group number
    }

    this._onResize({})
    this._onSettingsChange({})
  }

  componentDidMount () {
    this.focusListener = this._onFocus.bind(this)
    this.resizeListener = this._onResize.bind(this)
    window.addEventListener('focus', this.focusListener)
    window.addEventListener('resize', this.resizeListener)
    window.addEventListener('storage', this._onSettingsChange)

    // Setup Hammer.js - The touch event handler.
    this.hammertime = new Hammer(document.getElementById('app'))
    this.hammertime.on('swipe', this._onSwipe)

    this.hourChangeInterval = setInterval(() => {
      if (document.hidden) return

      this._updateToday()
    }, 30000)

    const scrollTimeout = this._scrollToToday()

    // Settings from hash
    if (window.location.hash.length > 1) {
      const hashSettings = qs.parse(window.location.hash.slice(1))

      const toChangeState = {}
      let shouldSave = false

      const group = +hashSettings.group
      if (!Number.isNaN(group) && group > 0 && group <= 6) {
        toChangeState.group = group
        shouldSave = true
      }

      const schichtmodell = hashSettings.schichtmodell
      if (schichtmodell != null && shiftModelNames.includes(schichtmodell)) {
        this._changeModel(schichtmodell)
        shouldSave = true

        if (toChangeState.group && toChangeState.group > shiftModelNumberOfGroups[schichtmodell]) {
          toChangeState.group = 0
        }
      }

      if (hashSettings.search != null && hashSettings.search.length >= 8) {
        const date = new Date(hashSettings.search)
        const searchYear = date.getFullYear()
        const searchMonth = date.getMonth()
        const searchDay = date.getDate()

        toChangeState.search = [searchYear, searchMonth, searchDay]

        setTimeout(this._scrollToADay, 16 * 4, searchYear, searchMonth, searchDay)
        clearTimeout(scrollTimeout)
      }

      this.setState(toChangeState)
      if (shouldSave) {
        this.saveSettings()
      }
      window.location.hash = ''
    }
  }

  componentWillUnmount () {
    window.removeEventListener('focus', this.focusListener)
    window.removeEventListener('resize', this.resizeListener)
    window.removeEventListener('storage', this._onSettingsChange)

    this.hammertime.off('swipe', this._onSwipe)

    clearInterval(this.hourChangeInterval)
  }

  _onSettingsChange = event => {
    const {
      didSelectModel = false,
      group = 0,
      shiftModel = shift66Name
    } = JSON.parse(window.localStorage.getItem('settings') || '{}')

    this.setState({
      didSelectModel,
      group,
      shiftModel
    })
  }

  saveSettings () {
    setTimeout(() => {
      const data = {
        didSelectModel: this.state.didSelectModel,
        group: this.state.group,
        shiftModel: this.state.shiftModel
      }

      window.localStorage.setItem('settings', JSON.stringify(data))
    }, 32)
  }

  /**
   * If the tab gets focus again.
   * @param {Object} event  Focus-event from the browser.
   */
  _onFocus (event) {
    this._updateToday()
  }

  /**
   * Updates today if it did change.
   */
  _updateToday () {
    const now = new Date()
    const today = now.getDate()
    const hour = now.getHours()

    // update today marker on refocus
    if (this.state.today[2] !== today || this.state.today[3] !== hour) {
      this.setState({
        today: [now.getFullYear(), now.getMonth(), today, hour]
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
   * @param {boolean} [arg0.scrollToToday] Should scroll to today, if it is in this month.
   */
  _onChangeMonth = ({
    year = this.state.year,
    month = this.state.month,
    relative,
    toggleFullYear,
    scrollToToday
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

    if (scrollToToday) {
      this._scrollToToday()
    }
  }

  /**
   * Change the displayed shift-model.
   * @param {string} nextModel Name of the shift-model that should be displayed.
   */
  _changeModel = nextModel => {
    if (shiftModelNames.every(model => model !== nextModel)) {
      throw new TypeError(`Unknown shift-model! "${nextModel}" is unknown!`)
    }
    this.setState({
      shiftModel: nextModel,
      didSelectModel: true
    })

    if (this.state.group > shiftModelNumberOfGroups[nextModel]) {
      this.setState({ group: 0 })
    }

    this.saveSettings()
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

      this.clearSearchScroll = setTimeout(this._scrollToADay, 16 * 4, year, month, day)
    } else {
      this.setState({
        search: null
      })
    }
  }

  /**
   * Scroll to a day.
   * @param {number} year Year of the day the view should scroll to
   * @param {number} month Month of the day the view should scroll to
   * @param {number} day Day in the month the view should scroll to
   */
  _scrollToADay (year, month, day) {
    const row = document.querySelector(`#month_${year}-${month + 1} tr:nth-child(${day})`)

    if (row != null && row.scrollIntoView != null) {
      row.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  /**
   * Scroll to today. But only if today is the active month!
   * It does it after an timeout.
   * @returns {number} Clear timeout ID/number.
   */
  _scrollToToday () {
    return setTimeout(() => {
      const [year, month, day] = this.state.today

      if (this.state.year === year && this.state.month === month) {
        this._scrollToADay(year, month, day)
      }
    }, 16 * 4)
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
    group = +group
    if (Number.isNaN(group) || group < 0 || group > 6) return

    this.setState({ group })

    this.saveSettings()
  }

  /**
   * Gets fired when the route changes.
   * @param {Object} event     "change" event from [preact-router](http://git.io/preact-router)
   * @param {string} event.url The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url
    this.setState({ url: e.url })
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
          shiftModel={this.state.shiftModel}
          onChange={this._onChangeMonth}
          toggleFullYear={this._toggleFullYear}
          search={this._search}
          searchResult={this.state.search}
          group={this.state.group}
          url={this.state.url}
          onGroupChange={this._changeGroup}
          onChangeModel={this._changeModel}
        />
        <Router onChange={this.handleRoute}>
          <Main
            path='/'
            numberOfMonths={this.state.fullYear ? 12 : this.state.numberOfMonths}
            year={this.state.year}
            month={this.state.month}
            shiftModel={this.state.shiftModel}
            today={this.state.today}
            search={this.state.search}
            group={this.state.group}
          />
          <Impressum path='/impressum/' />
        </Router>

        <InstallPrompt />

        {this.state.didSelectModel
          ? null
          : <FirstRunDialog
            onClick={model => {
              this._changeModel(model)
              this._scrollToToday()
            }}
          />
        }
      </div>
    )
  }
}
