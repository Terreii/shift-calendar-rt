import { h } from 'preact'
import style from './style.less'

const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const shiftTitle = {
  'F': 'Frühschicht\r\n6 - 14:30 Uhr',
  'S': 'Spätschicht\r\n14 - 22:30 Uhr',
  'N': 'Nachtschicht\r\n22 - 6:30 Uhr (in den nächsten Tag)',
  'K': null
}

export default ({ year, month, data }) => {
  const dayRows = data.days.map((day, index) => {
    const aDay = new Date(year, month, index + 1).getDay()
    const holidayData = data.holidays[index + 1]

    return <tr
      key={index}
      class={style.DayRow}
      data-day={aDay}
      data-holiday={holidayData != null ? holidayData.type : null}
      title={holidayData != null ? holidayData.name : null}
    >
      <td>{index + 1}</td>
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
