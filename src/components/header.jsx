/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Link } from 'preact-router'

import Menu from './menu'
import ShareMenu from './share-menu'

import { scrollToADay, isSSR } from '../lib/utils'

/**
 * Renders the Header.
 * @param {object}   param            Preact params.
 * @param {string}   param.url        The current url path.
 * @param {boolean}  param.isFullYear Is the full year shown.
 * @param {number}   param.month      The shown month in the year.
 * @param {number}   param.year       The shown year.
 * @param {number[]} [param.search]   Result of the search. [year, month, day]
 * @param {number}   param.group      The shown group. 0 = all groups
 * @param {string}   param.shiftModel The shown shift model. As in constants.shiftModelNames.
 * @param {function} param.dispatch   Change the global state using the reducers dispatch function.
 * @returns {JSX.Element}
 */
export default function Header ({
  url,
  isFullYear,
  month,
  year,
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

  return (
    <header
      class={'fixed top-0 left-0 w-screen h-12 flex flex-row items-center justify-between ' +
      'bg-green-900 shadow-lg z-50'}
    >
      {(url !== '/' || !isSmallScreen) && (
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
      {(url === '/' || !isSmallScreen) && (
        <nav class='h-full flex flex-row text-base items-stretch'>
          <button
            type='button'
            class='px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
            title='vorigen Monat'
            aria-label='vorigen Monat'
            aria-controls='calendar_main_out'
            onClick={() => {
              dispatch({ type: 'move', payload: -1 })
              hideMenu()
            }}
          >
            {'<'}
          </button>

          <button
            type='button'
            class='px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
            title='zeige aktuellen Monat'
            onClick={() => {
              const now = new Date()
              const year = now.getFullYear()
              const month = now.getMonth()
              dispatch({
                type: 'goto',
                fullYear: false,
                year,
                month
              })
              hideMenu()

              setTimeout(scrollToADay, 16, year, month, now.getDate())
            }}
          >
            Heute
          </button>

          <button
            type='button'
            class='px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none'
            title='nächster Monat'
            aria-label='nächster Monat'
            aria-controls='calendar_main_out'
            onClick={() => {
              dispatch({ type: 'move', payload: 1 })
              hideMenu()
            }}
          >
            {'>'}
          </button>

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
      )}

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

function useIsSmallScreen () {
  const [isSmallScreen, setIsSmallScreen] = useState(() => (
    isSSR || window.innerWidth < 350
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

      element.addEventListener('click', hide)
      return () => {
        element.removeEventListener('click', hide)
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
