import { h } from 'preact'
import style from './style.less'

import Month from '../month'

export default () => {
	return (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<Month year={2018} month={11} />
		</div>
	)
}
