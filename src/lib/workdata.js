/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { shift66Name, shift64Name } from './constants'
import { getDaysInMonth } from './utils'

/**
 * @typedef {Object} MonthWorkData
 * @property {("F"|"S"|"N"|"K")[][]} days         List of working days of every group
 * @property {number[]}              workingCount Count of working days of a group
 */

/**
 * Calculate when groups will work.
 * @param {number} year Full Year of that month
 * @param {number} month Month number
 * @param {string} shiftModel Which shift-model is it.
 * @returns {MonthWorkData} Working data of a group.
 */
export default function getMonthData (year, month, shiftModel) {
  switch (shiftModel) {
    case shift64Name:
      return get64Model(year, month)

    case shift66Name:
    default:
      return get66Model(year, month)
  }
}

/**
 * Get the working data of the 6-6 Model or the old 4-4 model.
 * @param {number} year Full Year of that month
 * @param {number} month Month number
 * @returns {MonthWorkData} Working data of groups in the 6-6 and old 4-4 models
 */
function get66Model (year, month) {
  const daysData = []
  const groupsWorkingDays = [0, 0, 0, 0, 0, 0]
  const isOldModel = year < 2010 || (year === 2010 && month < 3)
  const isOnSwitch = year === 2010 && month === 3

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = isOldModel || (isOnSwitch && i < 3) // if it is before the 2010-04-03
      ? get44ModelDay(year, month, i + 1) // get the old model
      : get66ModelDay(year, month, i + 1) // else get the 6-6 model

    daysData.push(aDay)

    aDay.forEach((isWorking, gr) => {
      if (isWorking !== 'K') {
        groupsWorkingDays[gr] += 1
      }
    })
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays
  }
}

/**
 * Get the working data of the new 6-4 Model.
 * @param {number} year Full Year of that month
 * @param {number} month Month number
 * @returns {MonthWorkData} Working data of the groups of the new 6-4 model
 */
function get64Model (year, month) {
  const daysData = []
  const groupsWorkingDays = [0, 0, 0, 0, 0]

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = get64ModelDay(year, month, i + 1)

    daysData.push(aDay)

    aDay.forEach((isWorking, gr) => {
      if (isWorking !== 'K') {
        groupsWorkingDays[gr] += 1
      }
    })
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays
  }
}

/**
 * Calculates the data of a day.
 * @param {number} year Full Year
 * @param {number} month Number of the month in the year
 * @param {number} day Day in the month
 * @returns {("F"|"S"|"N"|"K")[]} Working data of all groups on this day
 */
function get66ModelDay (year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime()

  // get days count since 1970-01-01 and divide them by 2 (because they are always 2 days of a type)
  const daysInCycle = Math.floor(time / 1000 / 60 / 60 / 24 / 2) % 6

  // Offset is for every group. When does the shift-cycle start?
  const groups = [3, 0, 2, 5, 1, 4].map(offset => {
    let shiftDay = daysInCycle + offset

    if (shiftDay > 5) {
      shiftDay -= 6
    }

    switch (shiftDay) {
      case 0:
        return 'F' // Früh/Early   6 - 14:30
      case 1:
        return 'S' // Spät/Late   14 - 22:30
      case 2:
        return 'N' // Nacht/Night 22 -  6:30
      default:
        return 'K' // No shift/free
    }
  })

  return groups
}

/**
 * Calculates the data of a day for the new 6-4 shift model.
 * @param {number} year Full Year
 * @param {number} month Number of the month in the year
 * @param {number} day Day in the month
 * @returns {("F"|"S"|"N"|"K")[]} Working data of all groups on this day
 */
function get64ModelDay (year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime()

  // get days count since 1970-01-01 and divide them by 2 (because they are always 2 days of a type)
  const daysInCycle = Math.floor(time / 1000 / 60 / 60 / 24 / 2) % 5

  // Offset is for every group.
  return [2, 3, 4, 0, 1].map((offset, group) => {
    let shiftDay = daysInCycle + offset

    if (shiftDay > 4) {
      shiftDay -= 5
    }

    // Groups 3 - 5 (index 2 - 4) are working FFSSNN
    if (group >= 2) {
      switch (shiftDay) {
        case 0:
          return 'F' // Früh/Early   6 - 14:30
        case 1:
          return 'S' // Spät/Late   14 - 22:30
        case 2:
          return 'N' // Nacht/Night 22 -  6:30
        default:
          return 'K' // No shift/free
      }
    }

    // Group 1 (index 0) works SSNNNN
    // Group 2 (index 1) works FFFFSS
    switch (shiftDay) {
      case 0:
        return group === 1 ? 'F' : 'S'
      case 1:
        return group === 1 ? 'F' : 'N'
      case 2:
        return group === 1 ? 'S' : 'N'
      default:
        return 'K' // No shift/free
    }
  })
}

/**
 * Calculates the data of a day for the old 4-4 shift model.
 * It is NNNN-KKKK-SSSS-KKKK-FFFF-KKKK.
 * @param {number} year Full Year
 * @param {number} month Number of the month in the year
 * @param {number} day Day in the month
 * @returns {("F"|"S"|"N"|"K")[]} Working data of all groups on this day
 */
function get44ModelDay (year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime()

  // get days count since 1.1.1970
  // (4 working days + 4 free days) * 3 shifts = 24
  const daysInCycle = (time / 1000 / 60 / 60 / 24) % 24

  // Offset is for every group. When does the shift-cycle start?
  const groups = [14, 10, 6, 2, 22, 18].map(offset => {
    let shiftDay = Math.floor((daysInCycle + offset) / 4)

    if (shiftDay > 5) {
      shiftDay -= 6
    }

    switch (shiftDay) {
      case 0:
        return 'N' // Nacht/Night 22 -  6:30
      case 2:
        return 'S' // Spät/Late   14 - 22:30
      case 4:
        return 'F' // Früh/Early   6 - 14:30
      default:
        return 'K' // No shift/free
    }
  })

  return groups
}
