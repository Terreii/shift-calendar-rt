import { h } from 'preact'
import style from './style.less'

const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const holiday = {
  14: 'full',
  6: 'general'
}

export default ({ year, month }) => {
  const daysInMonth = getDaysInMonth(year, month)

  const dayRows = []

  for (let i = 0; i < daysInMonth; ++i) {
    const aDay = new Date(year, month, i + 1).getDay()

    dayRows.push(<tr
      key={`${year}-${month}-${i}`}
      class={style.DayRow}
      data-day={aDay}
      data-holiday={holiday[i]}
    >
      <td>{i + 1}</td>
      <td>{dayName[aDay]}</td>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
      <td data-working>5</td>
      <td>6</td>
    </tr>)
  }

  return <tbody>{dayRows}</tbody>
}

function getDaysInMonth (year, month) {
  // first day in month is 1. 0 is the one before --> last day of month!
  return new Date(year, month + 1, 0).getDate()
}
