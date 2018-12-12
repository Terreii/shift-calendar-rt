// Calculate when groups will work

export function get6_6Model (year, month) {
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
