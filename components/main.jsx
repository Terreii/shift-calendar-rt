/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ms from 'milliseconds'

import Downloader from './download'
import Footer from './footer'
import Month from './month'
import selectMonthData from '../lib/select-month-data'
import { scrollToADay, getCalUrl } from '../lib/utils'

/**
 * Renders the main content.
 * It will get the month-data from "selectMonthData" and renders the months.
 * @param {Object}    arg0                React/Preact arguments.
 * @param {number}    arg0.isFullYear     Display the full year. All 12 months.
 * @param {string}    arg0.year           Year of the selected month.
 * @param {string}    arg0.month          Month number of the selected month.
 * @param {string}    arg0.shiftModel     Which shift-model should be used.
 * @param {Number[]}  arg0.today      Array of numbers that contains todays date. [year, month, day]
 * @param {number}    arg0.search         The day in the month that was searched.
 * @param {string}    arg0.group          Group to display. 0 = All, 1 - 6 is group number.
 * @returns {JSX.Element}
 */
export default function Main ({
  isFullYear,
  year: yearString,
  month: monthString = '1',
  shiftModel,
  today,
  search,
  group: groupString = '0'
}) {
  const year = +yearString
  const month = Math.min(Math.max(parseInt(monthString, 10) - 1, 0), 11)
  const group = Number.isNaN(groupString)
    ? 0
    : Math.max(parseInt(groupString, 10), 0)
  const ref = useHammer(isFullYear, year, month, shiftModel, group)

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
        monthsData.push([year, month, search])
        break

      case 2: // if there are only 2 months: show this and the next one
      {
        monthsData.push([year, month, search])

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

          if (search && monthNr === month && yearNr === year) {
            monthsData.push([year, month, search])
            continue
          }

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

  useEffect(() => {
    if (search) {
      scrollToADay(year, month, search)
    }
  }, [search])

  return (
    <main className='flex flex-col content-center'>
      <div
        id='calendar_main_out'
        className='flex flex-row flex-wrap justify-around px-5 pt-16 pb-2'
        onClick={processClick}
        ref={ref}
        aria-live='polite'
      >
        {monthsData.map(([year, month, search]) => (
          <Month
            key={`${year}-${month}-${shiftModel}-${group}`}
            year={year}
            month={month}
            data={selectMonthData(year, month, shiftModel)}
            today={today[0] === year && today[1] === month ? today : null}
            search={search != null ? +search : null}
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
  const [numberOfMonths, setNumberOfMonths] = useState(() => {
    try {
      return window.innerWidth < 1220 ? 1 : 4
    } catch (err) {
      return 1
    }
  })

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
 * @param {boolean}  isFullYear  Is the full year displayed?
 * @param {number}   year        The current year.
 * @param {number}   month       The current month.
 * @param {string}   shiftModel  Selected shift-model.
 * @param {number}   group       Shift group.
 */
function useHammer (isFullYear, year, month, shiftModel, group) {
  const [container, setContainer] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (isFullYear || container == null) return
    let isActive = true

    const handler = event => {
      switch (event.direction) {
        case 2: // right to left
        {
          const time = new Date()
          time.setMonth(month)
          time.setFullYear(year)
          time.setTime(time.getTime() + ms.months(1))

          router.push(getCalUrl({
            group,
            shiftModel,
            isFullYear,
            year: time.getFullYear(),
            month: time.getMonth() + 1
          }))
          break
        }

        case 4: // left to right
        {
          const time = new Date()
          time.setMonth(month)
          time.setFullYear(year)
          time.setTime(time.getTime() - ms.months(1))

          router.push(getCalUrl({
            group,
            shiftModel,
            isFullYear,
            year: time.getFullYear(),
            month: time.getMonth() + 1
          }))
          break
        }

        default: break
      }
    }

    let hammertime
    import('hammerjs').then(({ default: Hammer }) => {
      if (isActive) {
        hammertime = new Hammer(container)
        hammertime.on('swipe', handler)
      }
    })
    return () => {
      isActive = false
      if (hammertime) {
        hammertime.off('swipe', handler)
      }
    }
  }, [isFullYear, year, month, shiftModel, group, container])

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
