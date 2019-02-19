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
 * @param {string}    arg0.displayOption  How many months should be displayed?
 * @param {number}    arg0.year           Year of the selected month.
 * @param {number}    arg0.month          Month number of the selected month.
 * @param {boolean}   arg0.is64Model      Show 6-4 Model or the old 6-6 Model.
 * @param {Number[]}  arg0.today      Array of numbers that contains todays date. [year, month, day]
 * @returns {JSX.Element}
 */
export default ({ displayOption, year, month, is64Model, today, search }) => {
  let monthsData = []

  switch (displayOption) {
    case 'full': // Render all 12 months of the selected year
      for (let i = 0; i < 12; ++i) {
        monthsData.push({
          year,
          month: i,
          data: selectMonthData(year, i, is64Model)
        })
      }
      break

    case '4': // Render the selected month, one before and two after it.
      for (let i = 0; i < 4; ++i) {
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

    case '1': // Renders the selected month
    default:
      monthsData.push({
        year,
        month,
        data: selectMonthData(year, month, is64Model)
      })
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
          is64Model={is64Model}
          search={search != null && search[0] === year && search[1] === month ? search[2] : null}
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
