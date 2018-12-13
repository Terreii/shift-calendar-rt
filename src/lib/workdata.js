// Calculate when groups will work

export default function getMonthData (year, month) {
  const data = get6_6Model(year, month)
  data.holidays = getHolidays(year, month)
  return data
}

function getHolidays (year, month) {
  switch (month) {
    case 2:
    case 3:
      const easter = getEaster(year) // Is the easter sunday
                                     // and the number is day since beginning of March
      const dayOfEaster = month === 3 ? easter - 31 : easter // transform it into a day in month

      const easterData = {
        name: 'Ostern',
        type: 'closing'
      }

      const data = {}

      for (let i = -2; i < 2; ++i) { // All 4 easter days
        const aEasterDay = dayOfEaster + i
        if (aEasterDay > 0) {
          data[aEasterDay] = easterData
        }
      }

      if (month === 2) {
        const daylightSavingSwitch = getDaylightSavingDay(year, month)
        data[daylightSavingSwitch] = {
          name: 'Zeitumstellung!\r\nEs wird um 1 Stunde vor (von 2 Uhr auf 3 Uhr) gestellt.',
          type: 'dayLightSaving'
        }
      }

      return data

    case 9:
      const daylightSavingSwitch = getDaylightSavingDay(year, month)
      return {
        [daylightSavingSwitch]: {
          name: 'Zeitumstellung!\r\nEs wird um 1 Stunde zurück (von 3 Uhr auf 2 Uhr) gestellt.',
          type: 'dayLightSaving'
        }
      }

    case 11:
      const xmasData = {
        name: 'Weihnachten',
        type: 'closing'
      }
      return {
        24: xmasData,
        25: xmasData,
        26: xmasData
      }

    default:
      return {}
  }
}

function get6_6Model (year, month) {
  const daysData = []
  const groupsWorkingDays = [0, 0, 0, 0, 0, 0]

  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = get6_6ModelDay(year, month, i + 1)

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

  // get days count and divide them by 2 (because they are always 2 days of a type)
  const daysInCycle = Math.floor(time / 1000 / 60 / 60 / 24 / 2) % 6

  // Offset is for every group. When does the shift-cycle start?
  const groups = [3, 0, 2, 5, 1, 4].map((offset, gr) => {
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

function getDaysInMonth (year, month) {
  // first day in month is 1. 0 is the one before --> last day of month!
  return new Date(year, month + 1, 0).getDate()
}

// Gauss's Easter algorithm  https://en.wikipedia.org/wiki/Computus#Gauss's_Easter_algorithm
function getEaster (year) {
  const k = Math.floor(year / 100)
  const M = 15 + k - Math.floor(k / 3) - Math.floor(k / 4)
  const N = 5
  const a = Math.round(afterDot(year / 19) * 19)
  const b = Math.round(afterDot(year / 4) * 4)
  const c = Math.round(afterDot(year / 7) * 7)
  const d = Math.round(afterDot((19 * a + M) / 30) * 30)
  const e = Math.round(afterDot((2 * b + 4 * c + 6 * d + N) / 7) * 7)
  return 22 + d + e
}

function afterDot(number) { // 1.1 - 1.0 = 0.1
  return number - Math.floor(number)
}

function getDaylightSavingDay (year, month) {
  if (month !== 2 && month !== 9) return -1

  for (let day = getDaysInMonth(year, month), min = day - 9; day > min; --day) {
    if (new Date(year, month, day).getDay() === 0) { // if it is the last sunday in the month
      return day
    }
  }

  return -1
}
