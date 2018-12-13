import { h } from 'preact'
import style from './style.less'

import Month from '../month'

export default ({ year, month, data, today }) => {
	return (
		<div class={style.home} onClick={processClick}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<Month year={year} month={month} data={data} today={today} />
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
