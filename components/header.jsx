/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import Link from 'next/link'

import Menu from './menu'
import ShareMenu from './share-menu'
import NavLinks from './header-nav-links'

import { useQueryProps } from '../hooks/settings'

/**
 * Renders the Header.
 */
export default function Header () {
  const { url, year, month, isFullYear, group, search, shiftModel } = useQueryProps()

  const isSmallScreen = useIsSmallScreen()
  const [showMenu, setShowMenu] = useShowMenu('nav')
  const [showShareMenu, setShowShareMenu] = useShowMenu('#share_menu')

  const hideMenu = () => setShowMenu(false)

  return (
    <header
      className='fixed top-0 left-0 z-50 flex flex-row items-center justify-between w-screen h-12 bg-green-900 shadow-lg'
    >
      {(!isSmallScreen || !url.startsWith('/cal')) && (
        <h1 className='m-0 text-2xl font-normal align-baseline'>
          <Link href='/'>
            <a
              className='pl-4 text-white no-underline hover:underline focus:underline focus:ring focus:outline-none'
            >
              Kalender
            </a>
          </Link>
        </h1>
      )}
      <nav className='flex flex-row items-stretch h-full text-base'>
        {(!isSmallScreen || url.startsWith('/cal')) && (
          <NavLinks
            isFullYear={isFullYear}
            month={month}
            year={year}
            group={group}
            shiftModel={shiftModel}
          />
        )}

        <Menu
          show={showMenu}
          isFullYear={isFullYear}
          month={month}
          year={year}
          search={search}
          group={group}
          shiftModel={shiftModel}
          setShowMenu={setShowMenu}
          onShare={() => {
            hideMenu()
            setShowShareMenu(true)
          }}
        />
      </nav>

      {showShareMenu && (
        <ShareMenu
          group={group}
          month={month}
          year={year}
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
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    try {
      return window.innerWidth < 350
    } catch (err) {
      return true
    }
  })

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

/**
 * Handle the show state of a menu.
 * @param {string} insideSelector Selector for the container,
 *                                clicking outside of which the menu will close the menu.
 */
function useShowMenu (insideSelector) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) {
      // Hide on click outside of insideSelector
      const hide = event => {
        if (event.target.closest(insideSelector) == null) {
          setShow(false)
        }
      }

      // Hide on hitting ESC
      const keyEvent = event => {
        if (event.code === 'Escape' || event.keyCode === 27) {
          setShow(false)

          // Focus the menu toggle button, Because both menus start from there.
          const element = document.getElementById('menu_summary')
          if (element) {
            element.focus()
          }
        }
      }

      window.addEventListener('click', hide)
      window.addEventListener('keyup', keyEvent)
      return () => {
        window.removeEventListener('click', hide)
        window.removeEventListener('keyup', keyEvent)
      }
    }
  }, [show, insideSelector])

  return [show, setShow]
}
