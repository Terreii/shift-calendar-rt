/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import { Link } from 'preact-router'
import style from './style.less'

import Menu from '../menu'
import ShareMenu from '../shareMenu'

import hamburgerIcon from '../../assets/icons/hamburger_icon.svg'

/**
 * Renders the Header.
 */
export default class Header extends Component {
  constructor (args) {
    super(args)

    this.state = {
      showMenu: false,
      showShareMenu: false
    }
  }

  componentWillUnmount () {
    this._removeListener()
  }

  _toggleShowMenu = event => {
    const shouldShow = !this.state.showMenu

    this.setState({
      showMenu: shouldShow
    })

    this.hideShare()

    setTimeout(() => {
      if (shouldShow) {
        const element = document.getElementsByTagName('main')[0]
        if (element != null) {
          element.addEventListener('click', this.hideMenu)
        }
      } else {
        this._removeListener()
      }
    }, 0)
  }

  hideMenu = () => {
    this.setState({
      showMenu: false
    })
    this._removeListener()
  }

  _removeListener () {
    const element = document.getElementsByTagName('main')[0]
    if (element != null) {
      element.removeEventListener('click', this.hideMenu)
    }
  }

  _handleGotoEvent = (event, hide) => {
    this.props.onChange(event)

    if (hide) {
      this.hideMenu()
    }
  }

  onShare = event => {
    this.setState({
      showShareMenu: true
    })
    this.hideMenu()

    const element = document.getElementsByTagName('main')[0]
    element.addEventListener('click', this.hideShare)
  }

  hideShare = () => {
    const element = document.getElementsByTagName('main')[0]
    element.removeEventListener('click', this.hideShare)

    this.setState({
      showShareMenu: false
    })
  }

  /**
   * Renders the Header
   * @returns {JSX.Element}
   */
  render () {
    return (
      <header class={style.header}>
        <h1><Link href='/' tabIndex='0'>Kalender</Link></h1>
        <nav>
          <button
            title='vorigen Monat'
            aria-label='vorigen Monat'
            onClick={() => {
              this.props.onChange({ relative: -1, toggleFullYear: true })
              this.hideMenu()
            }}
          >
            {'<'}
          </button>

          <button
            title='zeige aktuellen Monat'
            onClick={() => {
              const now = new Date()
              this.props.onChange({
                year: now.getFullYear(),
                month: now.getMonth(),
                toggleFullYear: true,
                scrollToToday: true
              })
              this.hideMenu()
            }}
          >
            Heute
          </button>

          <button
            title='nächster Monat'
            aria-label='nächster Monat'
            onClick={() => {
              this.props.onChange({ relative: 1, toggleFullYear: true })
              this.hideMenu()
            }}
          >
            {'>'}
          </button>

          <button class={style.Hamburger} onClick={this._toggleShowMenu}>
            <img src={hamburgerIcon} height='45' width='45' alt='Menu' />
          </button>
        </nav>

        <Menu
          show={this.state.showMenu}
          isFullYear={this.props.isFullYear}
          month={this.props.month}
          year={this.props.year}
          search={this.props.searchResult}
          group={this.props.group}
          gotoMonth={this._handleGotoEvent}
          onSearch={this.props.search}
          toggleFullYear={() => {
            this.props.toggleFullYear()
            this.hideMenu()
          }}
          onGroupChange={this.props.onGroupChange}
          onShare={this.onShare}
        />

        {this.state.showShareMenu
          ? <ShareMenu
            group={this.props.group}
            search={this.props.searchResult}
            hide={this.hideShare}
          />
          : null
        }
      </header>
    )
  }
}
