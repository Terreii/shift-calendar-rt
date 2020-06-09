/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { html, useState, useEffect } from '../preact.js'
import { Link } from '../web_modules/preact-router.js'

import Menu from './menu.js'
import ShareMenu from './share-menu.js'

/**
 * Renders the Header.
 * @param {object}   param            Preact params.
 * @param {string}   param.url        The current url path.
 * @param {boolean}  param.isFullYear Is the full year shown.
 * @param {number}   param.month      The shown month in the year.
 * @param {number}   param.year       The shown year.
 * @param {number[]} [param.searchResult] Result of the search. [year, month, day]
 * @param {number}   param.group      The shown group. 0 = all groups
 * @param {string}   param.shiftModel The shown shift model. As in constants.shiftModelNames.
 * @param {function} param.onChange   Change the current shown month.
 * @param {function} param.onChangeModel Change the shown shift model.
 * @param {function} param.onGroupChange Change the shown group.
 * @param {function} param.search     Do a search for a day.
 * @param {function} param.toggleFullYear Toggle between showing the full year and some months.
 * @returns {JSX.Element}
 */
export default function Header ({
  url,
  isFullYear,
  month,
  year,
  searchResult,
  group,
  shiftModel,
  onChange,
  onChangeModel,
  onGroupChange,
  search,
  toggleFullYear
}) {
  const isSmallScreen = useIsSmallScreen()
  const [showMenu, setShowMenu] = useShowMenu()
  const [showShareMenu, setShowShareMenu] = useShowMenu()

  const hideMenu = () => setShowMenu(false)
  const toggleShowMenu = () => setShowMenu(old => !old)

  return html`
    <header
      class=${'fixed top-0 left-0 w-screen h-12 flex flex-row items-center justify-between ' +
        'bg-green-900 shadow-lg z-50'}
    >
      ${(url !== '/' || !isSmallScreen) && html`
        <h1 class='m-0 text-2xl font-normal align-baseline'>
          <${Link}
            href='/'
            tabIndex='0'
            class=${'pl-4 text-white no-underline hover:underline focus:underline ' +
              'focus:shadow-outline'}
          >
            Kalender
          </${Link}>
        </h1>
      `}
      ${(url === '/' || !isSmallScreen) && html`
        <nav class="h-full flex flex-row text-base items-stretch">
          <button
            class=${'px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 ' +
              'focus:shadow-outline focus:outline-none'}
            title="vorigen Monat"
            aria-label="vorigen Monat"
            onClick=${() => {
              onChange({ relative: -1, toggleFullYear: true })
              hideMenu()
            }}
          >
            ${'<'}
          </button>

          <button
            class=${'px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 ' +
              'focus:shadow-outline focus:outline-none'}
            title="zeige aktuellen Monat"
            onClick=${() => {
              const now = new Date()
              onChange({
                year: now.getFullYear(),
                month: now.getMonth(),
                toggleFullYear: true,
                scrollToToday: true
              })
              hideMenu()
            }}
          >
            Heute
          </button>

          <button
            class=${'px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 ' +
              'focus:shadow-outline focus:outline-none'}
            title="nächster Monat"
            aria-label="nächster Monat"
            onClick=${() => {
              onChange({ relative: 1, toggleFullYear: true })
              hideMenu()
            }}
          >
            ${'>'}
          </button>

          <button
            class=${'flex justify-center items-center bg-transparent hover:bg-green-600 ' +
              'active:bg-green-600 w-16 focus:shadow-outline focus:outline-none'}
            onClick=${toggleShowMenu}
          >
            <img
              src="/assets/icons/hamburger_icon.svg"
              style=${{ filter: 'invert(100%)' }}
              height="45"
              width="45"
              alt="Menu"
            />
          </button>
        </nav>
      `}

      <${Menu}
        show=${showMenu}
        isFullYear=${isFullYear}
        month=${month}
        year=${year}
        search=${searchResult}
        group=${group}
        shiftModel=${shiftModel}
        gotoMonth=${(event, hide) => {
          onChange(event)

          if (hide) {
            hideMenu()
          }
        }}
        onSearch=${search}
        onChangeModel=${onChangeModel}
        toggleFullYear=${() => {
          toggleFullYear()
          hideMenu()
        }}
        onGroupChange=${onGroupChange}
        onShare=${() => {
          hideMenu()
          setShowShareMenu(true)
        }}
      />

      ${showShareMenu && html`
        <${ShareMenu}
          group=${group}
          search=${searchResult}
          shiftModel=${shiftModel}
          hide=${() => {
            setShowShareMenu(false)
          }}
        />
      `}
    </header>
  `
}

function useIsSmallScreen () {
  const [isSmallScreen, setIsSmallScreen] = useState(() => (
    window.innerWidth < 350
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

  return [show, setShow]
}
