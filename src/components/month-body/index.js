import { h } from 'preact'
import style from './style.less'

const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const shiftTitle = {
  'F': 'Frühschicht\r\n6 - 14:30 Uhr',
  'S': 'Spätschicht\r\n14 - 22:30 Uhr',
  'N': 'Nachtschicht\r\n22 - 6:30 Uhr (in den nächsten Tag)',
  'K': null
}

export default ({ year, month, data, today }) => {
  const todayInThisMonth = today != null && today[0] === year && today[1] === month

  const dayRows = data.days.map((day, index) => {
    const thatDay = index + 1
    const aDay = new Date(year, month, thatDay).getDay()
    const holidayData = data.holidays[thatDay]

    const isDayLightSaving = data.holidays.daylightSavingSwitch != null &&
      data.holidays.daylightSavingSwitch.day === thatDay

    return <tr
      key={index}
      class={style.DayRow}
      data-day={aDay}
      data-today={todayInThisMonth && thatDay === today[2]}
      data-holiday={holidayData != null ? holidayData.type : null}
      title={holidayData != null ? holidayData.name : null}
    >
      <td
        data-dayLightSaving={isDayLightSaving}
        title={isDayLightSaving ? data.holidays.daylightSavingSwitch.name : null}
      >
        {thatDay}
      </td>
      <td>{dayName[aDay]}</td>
      {day.map((shift, gr) => (
        <td
          key={gr}
          title={shiftTitle[shift]}
          data-working={shift !== 'K'}
        >
          {shift === 'K' ? '' : shift}
        </td>
      ))}
    </tr>
  })

  return <tbody>
    {dayRows}
    <tr class={style.WorkinDaysRow}>
      <td
        class={style.WorkingDaysInfo}
        colSpan='2'
        title='Die Anzahl der Tage, an denen eine Schichtgruppe diesen Monat arbeitet.'
      >
        Anzahl
      </td>
      {data.workingCount.map((number, index) => <td key={index}>{number}</td>)}
    </tr>
  </tbody>
}
