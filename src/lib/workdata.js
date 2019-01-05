/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { getDaysInMonth } from './utils'

// Calculate when groups will work
export default function getMonthData (year, month, is6_4 = false) {
  const data = is6_4
    ? get6_4Model(year, month)
    : get6_6Model(year, month)

  return data
}

function get6_6Model (year, month) {
  const daysData = []
  const groupsWorkingDays = [0, 0, 0, 0, 0, 0]
  const isOldModel = year < 2010 || (year === 2010 && month < 3)
  const isOnSwitch = year === 2010 && month === 3

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = isOldModel || (isOnSwitch && i < 3)
      ? get4_4ModelDay(year, month, i + 1)
      : get6_6ModelDay(year, month, i + 1)

    daysData.push(aDay)

    aDay.forEach((isWorking, gr) => {
      if (isWorking != 'K') {
        groupsWorkingDays[gr] += 1
      }
    })
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays
  }
}

function get6_4Model (year, month) {
  const daysData = []
  const groupsWorkingDays = [0, 0, 0, 0, 0]

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = get6_4ModelDay(year, month, i + 1)

    daysData.push(aDay)

    aDay.forEach((isWorking, gr) => {
      if (isWorking != 'K') {
        groupsWorkingDays[gr] += 1
      }
    })
  }

  return {
    days: daysData,
    workingCount: groupsWorkingDays
  }
}

function get6_6ModelDay (year, month, day) {
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

// The new 6-4 shift model
function get6_4ModelDay (year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime()

  // get days count since 1970-01-01 and divide them by 2 (because they are always 2 days of a type)
  const daysInCycle = Math.floor(time / 1000 / 60 / 60 / 24 / 2) % 5

  // Offset is for every group. When does the shift-cycle start?
  // TODO: change offsets as soon as the new shift-model calendars are released!
  return [2, 1, 0, 4, 3].map((offset, group) => {
    let shiftDay = daysInCycle + offset

    if (shiftDay > 4) {
      shiftDay -= 5
    }

    if (group < 3) {
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

    // Group 4 (index 3) works FFFFSS
    // Group 5 (index 4) works SSNNNN
    switch (shiftDay) {
      case 0:
        return group === 3 ? 'F' : 'S'
      case 1:
        return group === 3 ? 'F' : 'N'
      case 2:
        return group === 3 ? 'S' : 'N'
      default:
        return 'K' // No shift/free
    }
  })
}

function get4_4ModelDay (year, month, day) {
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
