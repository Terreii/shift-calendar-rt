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

export default ({ year, month, data }) => {
  return <table class={style.Main}>
    <caption>{monthNames[month]}</caption>
    <thead>
      <tr>
        <th>Tag</th>
        <th />
        {[1, 2, 3, 4, 5, 6].map(gr => <th key={gr}>Gr. {gr}</th>)}
      </tr>
    </thead>
    <MonthBody year={year} month={month} data={data} />
  </table>
}
