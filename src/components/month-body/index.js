import { h } from 'preact'
import style from './style.less'

const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const holiday = {
  14: 'full',
  6: 'general'
}

export default ({ year, month, data }) => {
  const dayRows = data.days.map((day, index) => {
    const aDay = new Date(year, month, index + 1).getDay()

    return <tr
      key={index}
      class={style.DayRow}
      data-day={aDay}
      data-holiday={holiday[index]}
    >
      <td>{index + 1}</td>
      <td>{dayName[aDay]}</td>
      {day.map((shift, gr) => (
        <td
          key={gr}
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
      <td colSpan='2'>Anzahl</td>
      {data.workingCount.map((number, index) => <td key={index}>{number}</td>)}
    </tr>
  </tbody>
}
