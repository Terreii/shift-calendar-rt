/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import Hammer from 'hammerjs'

import Downloader from './download'
import Footer from './footer'
import Month from './month'
import selectMonthData from '../lib/select-month-data'
import { isSSR } from '../lib/utils'

/**
 * Renders the main content.
 * It will get the month-data from "selectMonthData" and renders the months.
 * @param {Object}    arg0                React/Preact arguments.
 * @param {number}    arg0.isFullYear     Display the full year. All 12 months.
 * @param {number}    arg0.year           Year of the selected month.
 * @param {number}    arg0.month          Month number of the selected month.
 * @param {string}    arg0.shiftModel     Which shift-model should be used.
 * @param {Number[]}  arg0.today      Array of numbers that contains todays date. [year, month, day]
 * @param {number[]}  arg0.search     Array of numbers that contains the date of the search result.
 * @param {number}    arg0.group          Group to display. 0 = All, 1 - 6 is group number.
 * @param {Function}  arg0.dispatch   Change the global state using the reducers dispatch function.
 * @returns {JSX.Element}
 */
export default function Main ({
  isFullYear,
  year,
  month,
  shiftModel,
  today,
  search,
  group,
  dispatch
}) {
  const ref = useHammer(dispatch, isFullYear)

  const numberOfMonths = useNumberOfMonths(group, isFullYear)

  const monthsData = []

  if (isFullYear) {
    // Render all 12 months of the selected year
    for (let i = 0; i < 12; ++i) {
      monthsData.push([year, i])
    }
  } else {
    switch (numberOfMonths) {
      case 1: // Renders the selected month
        monthsData.push([year, month])
        break

      case 2: // if there are only 2 months: show this and the next one
      {
        monthsData.push([year, month])

        let nextMonth = month + 1
        let nextYear = year

        if (nextMonth > 11) {
          nextMonth -= 12
          nextYear += 1
        }

        monthsData.push([nextYear, nextMonth])
        break
      }

      case 4: // Render the selected month, one before and the rest after it.
      default:
        for (let i = 0; i < numberOfMonths; ++i) {
          let monthNr = month + (i - 1)
          let yearNr = year

          if (monthNr > 11) {
            monthNr -= 12
            yearNr += 1
          } else if (monthNr < 0) {
            monthNr += 12
            yearNr -= 1
          }

          monthsData.push([yearNr, monthNr])
        }
        break
    }
  }

  return (
    <main class='flex flex-col content-center'>
      <div
        id='calendar_main_out'
        class='flex flex-row flex-wrap justify-around pt-16 px-5 pb-2'
        onClick={processClick}
        ref={ref}
        aria-live='polite'
      >
        {monthsData.map(([year, month]) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            today={today[0] === year && today[1] === month ? today : null}
            search={search != null && search[0] === year && search[1] === month ? search[2] : null}
            group={group}
          />
        ))}
      </div>

      <Downloader shiftModel={shiftModel} />

      <Footer />
    </main>
  )
}

/**
 * How many months should be displayed, if not the full year.
 * @param {number}  group           - Which group to display. 0 is all groups.
 * @param {boolean} displayFullYear - Should the full year be displayed? All 12 months.
 * @returns {number} Number of months to display.
 */
function useNumberOfMonths (group, displayFullYear) {
  const [numberOfMonths, setNumberOfMonths] = useState(
    () => isSSR || window.innerWidth < 1220 ? 1 : 4
  )

  useEffect(() => {
    const onResize = () => {
      const nextNumberOfMonths = window.innerWidth < 1220 ? 1 : 4
      setNumberOfMonths(nextNumberOfMonths)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (displayFullYear) {
    return 12
  }

  return group > 0
    ? numberOfMonths * 2
    : numberOfMonths
}

/**
 * Setup Hammer and handle swipes.
 * @param {function} dispatch    Dispatch function of the reducer.
 * @param {boolean}  isFullYear  Is the full year displayed?
 */
function useHammer (dispatch, isFullYear) {
  const [container, setContainer] = useState(null)

  useEffect(() => {
    if (isFullYear || container == null) return

    const handler = event => {
      switch (event.direction) {
        case 2: // right to left
          dispatch({
            type: 'move',
            payload: 1
          })
          break

        case 4: // left to right
          dispatch({
            type: 'move',
            payload: -1
          })
          break
      }
    }

    const hammertime = new Hammer(container)
    hammertime.on('swipe', handler)
    return () => {
      hammertime.off('swipe', handler)
    }
  }, [isFullYear, container])

  return setContainer
}

/**
 * Checks if one td or tr element has an title and alert it.
 * @param {Object} event Click-event from the browser on an element.
 */
function processClick (event) {
  let target = event.target

  while (target && target.nodeName !== 'MAIN') {
    if (target.title && target.title.length > 0) {
      window.alert(target.title)
      return
    }

    target = target.parentNode
  }
}
