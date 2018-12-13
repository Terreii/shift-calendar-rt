import { h } from 'preact'
import style from './style.less'

import Month from '../month'
import selectMonthData from '../../lib/select-month-data'

export default ({ year, month, is6_4Model, today }) => {
	const data = selectMonthData(year, month, is6_4Model)

	return (
		<div class={style.home} onClick={processClick}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<Month year={year} month={month} data={data} today={today} is6_4Model={is6_4Model} />
		</div>
	)
}

function processClick (event) {
	let target = event.target

	while (['td', 'tr'].some(tag => target.nodeName.toLowerCase() === tag)) {
		if (target.title && target.title.length > 0) {
			alert(target.title)
			return
		}

		target = target.parentNode
	}
}
