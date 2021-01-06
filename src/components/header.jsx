/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Fragment } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { Link } from 'preact-router'
import ms from 'milliseconds'

import Menu from './menu'
import ShareMenu from './share-menu'
import NavLinks from './header-nav-links'

import { scrollToADay, isSSR } from '../lib/utils'

/**
 * Renders the Header.
 * @param {object}   param            Preact params.
 * @param {string}   param.url        The current url path.
 * @param {number[]} param.today      The current date.
 * @param {number[]} [param.search]   Result of the search. [year, month, day]
 * @param {number}   param.group      The shown group. 0 = all groups
 * @param {string}   param.shiftModel The shown shift model. As in constants.shiftModelNames.
 * @param {function} param.dispatch   Change the global state using the reducers dispatch function.
 * @returns {JSX.Element}
 */
export default function Header ({
  url,
  today,
  search,
  group,
  shiftModel,
  dispatch
}) {
  const isSmallScreen = useIsSmallScreen()
  const [showMenu, setShowMenu] = useShowMenu()
  const [showShareMenu, setShowShareMenu] = useShowMenu()

  const hideMenu = () => setShowMenu(false)
  const toggleShowMenu = () => setShowMenu(old => !old)

  const { year, month, isFullYear } = useParseURL(url)

  return (
    <header
      class={'fixed top-0 left-0 w-screen h-12 flex flex-row items-center justify-between ' +
      'bg-green-900 shadow-lg z-50'}
    >
      {(!isSmallScreen || !url.startsWith('/cal')) && (
        <h1 class='m-0 text-2xl font-normal align-baseline'>
          <Link
            href='/'
            tabIndex='0'
            class='pl-4 text-white no-underline hover:underline focus:underline focus:ring focus:outline-none'
          >
            Kalender
          </Link>
        </h1>
      )}
      <nav class='h-full flex flex-row text-base items-stretch'>
        {(!isSmallScreen || url.startsWith('/cal')) && (
          <NavLinks
            today={today}
            isFullYear={isFullYear}
            month={month}
            year={year}
            shiftModel={shiftModel}
            onClick={() => {
              setTimeout(scrollToADay, 32, ...today)
            }}
          />
        )}

        <button
          id='hamburger_menu_toggle'
          class='flex justify-center items-center bg-transparent hover:bg-green-600 active:bg-green-600 w-16 focus:ring focus:outline-none'
          onClick={toggleShowMenu}
          aria-controls='hamburger_menu'
        >
          <img
            src='/assets/icons/hamburger_icon.svg'
            style={{ filter: 'invert(100%)' }}
            height='45'
            width='45'
            alt='Menu'
          />
        </button>

        <Menu
          show={showMenu}
          isFullYear={isFullYear}
          month={month}
          year={year}
          search={search}
          group={group}
          shiftModel={shiftModel}
          gotoMonth={(event, hide) => {
            dispatch(event)

            if (hide) {
              hideMenu()
            }
          }}
          dispatch={dispatch}
          onSearch={search}
          toggleFullYear={() => {
            dispatch({ type: 'toggle_full_year' })
            hideMenu()
          }}
          onShare={() => {
            hideMenu()
            setShowShareMenu(true)
          }}
        />
      </nav>

      {showShareMenu && (
        <ShareMenu
          group={group}
          search={search}
          shiftModel={shiftModel}
          hide={() => {
            setShowShareMenu(false)
          }}
        />
      )}
    </header>
  )
}

function useParseURL (url) {
  return useMemo(() => {
    // If we are not at the calendar, links should go to today.
    if (!url.startsWith('/cal')) {
      const now = new Date()
      return {
        isFullYear: false,
        month: now.getMonth(),
        year: now.getFullYear()
      }
    }

    // get only the pathname. Host is only there for parsing.
    const parts = new URL(url, 'https://test.es').pathname.split('/')
    const year = Number.isNaN(parts[3]) ? new Date().getFullYear() : parseInt(parts[3])

    // If there is the month part, then it is not a full year.
    // /cal/:shiftModel/:year/:month
    if (parts.length > 4 && !Number.isNaN(parts[4])) {
      const month = parseInt(parts[4]) - 1
      return {
        isFullYear: false,
        month: Math.min(Math.max(month, 0), 11),
        year
      }
    }
    // Full year
    // /cal/:shiftModel/:year
    return {
      isFullYear: true,
      month: new Date().getMonth(),
      year
    }
  }, [url])
}

function useIsSmallScreen () {
  const [isSmallScreen, setIsSmallScreen] = useState(() => (
    !isSSR && window.innerWidth < 350
  ))

  useEffect(() => {
    const onResize = () => {
      setIsSmallScreen(window.innerWidth < 350)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return isSmallScreen
}

function useShowMenu () {
  const [show, setShow] = useState(false)

  // Hide on click main element
  useEffect(() => {
    if (show) {
      const hide = () => {
        setShow(false)
      }
      const element = document.getElementsByTagName('main')[0]

      if (element) {
        element.addEventListener('click', hide)
        return () => {
          element.removeEventListener('click', hide)
        }
      }
    }
  }, [show])

  // Hide on hitting ESC
  useEffect(() => {
    if (show) {
      const keyEvent = event => {
        if (event.code === 'Escape' || event.keyCode === 27) {
          setShow(false)

          // Focus the menu toggle button, Because both menus start from there.
          const element = document.getElementById('hamburger_menu_toggle')
          if (element) {
            element.focus()
          }
        }
      }

      document.body.addEventListener('keyup', keyEvent)
      return () => {
        document.body.removeEventListener('keyup', keyEvent)
      }
    }
  }, [show])

  return [show, setShow]
}
