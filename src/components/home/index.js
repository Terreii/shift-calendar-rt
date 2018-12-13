import { h } from 'preact'
import style from './style.less'

import Month from '../month'

export default ({year, month, data}) => {
	return (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<Month year={year} month={month} data={data} />
		</div>
	)
}
