/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import Month from '../month'
import Footer from '../footer'
import selectMonthData from '../../lib/select-month-data'

/**
 * Renders the main content.
 * It will get the month-data from "selectMonthData" and renders the months.
 * @param {Object}    arg0                React/Preact arguments.
 * @param {number}    arg0.numberOfMonths How many months should be displayed? 12 is this full year.
 * @param {number}    arg0.year           Year of the selected month.
 * @param {number}    arg0.month          Month number of the selected month.
 * @param {boolean}   arg0.is64Model      Show 6-4 Model or the old 6-6 Model.
 * @param {Number[]}  arg0.today      Array of numbers that contains todays date. [year, month, day]
 * @param {number[]}  arg0.search     Array of numbers that contains the date of the search result.
 * @param {number}    arg0.group          Group to display. 0 = All, 1 - 6 is group number.
 * @returns {JSX.Element}
 */
export default ({ numberOfMonths, year, month, is64Model, today, search, group }) => {
  const monthsData = []

  if (group > 0 && numberOfMonths < 12) {
    numberOfMonths *= 2
  }

  switch (numberOfMonths) {
    case 12: // Render all 12 months of the selected year
      for (let i = 0; i < 12; ++i) {
        monthsData.push({
          year,
          month: i,
          data: selectMonthData(year, i, is64Model)
        })
      }
      break

    case 1: // Renders the selected month
      monthsData.push({
        year,
        month,
        data: selectMonthData(year, month, is64Model)
      })
      break

    case 2: // if there are only 2 months: show this and the next one
      monthsData.push({
        year,
        month,
        data: selectMonthData(year, month, is64Model)
      })
      let nextMonth = month + 1
      let nextYear = year

      if (nextMonth > 11) {
        nextMonth -= 12
        nextYear += 1
      }

      monthsData.push({
        year: nextYear,
        month: nextMonth,
        data: selectMonthData(nextYear, nextMonth, is64Model)
      })
      break

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

        monthsData.push({
          year: yearNr,
          month: monthNr,
          data: selectMonthData(yearNr, monthNr, is64Model)
        })
      }
      break
  }

  return (
    <main class={style.MainContainer}>
      <div class={style.home} onClick={processClick}>
        {monthsData.map(({ year, month, data }) => <Month
          key={`${year}-${month}-${is64Model}`}
          year={year}
          month={month}
          data={data}
          today={today[0] === year && today[1] === month ? today : null}
          search={search != null && search[0] === year && search[1] === month ? search[2] : null}
          group={group}
        />)}
      </div>
      <Footer />
    </main>
  )
}

/**
 * Checkes if one td or tr element has an title and alert it.
 * @param {Object} event Click-event from the browser on an element.
 */
function processClick (event) {
  let target = event.target

  while (['td', 'tr'].some(tag => target.nodeName.toLowerCase() === tag)) {
    if (target.title && target.title.length > 0) {
      window.alert(target.title)
      return
    }

    target = target.parentNode
  }
}
