import { h } from 'preact'
import style from './style.less'

import MonthBody from '../month-body'

const monthNames = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
]

export default ({ year, month, data, today, is6_4Model }) => {
  const grRow = is6_4Model
    ? [1, 2, 3, 4, 5]
    : [1, 2, 3, 4, 5, 6]

  const isToday = today != null && today[0] === year && today[1] === month

  return <table class={style.Main}>
    <caption class={isToday ? style.ThisMonth : null}>
      {monthNames[month]} {year}{isToday ? ' (Jetzt)' : ''}
    </caption>
    <thead>
      <tr>
        <th>Tag</th>
        <th />
        {grRow.map(gr => <th key={gr}>Gr. {gr}</th>)}
      </tr>
    </thead>
    <MonthBody year={year} month={month} data={data} today={today} />
  </table>
}
