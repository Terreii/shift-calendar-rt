/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Menu from './menu'
import ShareMenu from './share-menu'
import NavLinks from './header-nav-links'

import { shift66Name } from '../lib/constants'
import { isSSR } from '../lib/utils'

/**
 * Renders the Header.
 * @param {object}   param            Preact params.
 * @param {string}   param.url        The current url path.
 * @param {number[]} [param.search]   Result of the search. [year, month, day]
 * @param {number}   param.group      The shown group. 0 = all groups
 * @param {number}   param.year       The shown year.
 * @param {number}   param.month      The shown month.
 * @param {boolean}  param.isFullYear Is the full year shown?
 * @param {string}   param.shiftModel The shown shift model. As in constants.shiftModelNames.
 * @returns {JSX.Element}
 */
export default function Header () {
  const router = useRouter()
  const {
    asPath: url,
    query: {
      shiftModel = shift66Name,
      year: yearStr,
      month: monthStr,
      group: groupStr = '0',
      search: searchStr
    }
  } = router
  const year = parseInt(yearStr) || new Date().getFullYear()
  const isFullYear = !monthStr
  const month = isFullYear ? 1 : parseInt(monthStr)
  const group = parseInt(groupStr)
  const search = searchStr && !Number.isNaN(searchStr) ? parseInt(searchStr, 10) : null

  const isSmallScreen = useIsSmallScreen()
  const [showMenu, setShowMenu] = useShowMenu()
  const [showShareMenu, setShowShareMenu] = useShowMenu()

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
          const element = document.getElementById('menu_summary')
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
