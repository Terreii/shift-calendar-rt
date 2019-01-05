/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import { Link } from 'preact-router'
import style from './style.less'

export default class Header extends Component {
	render () {
		return (
			<header class={style.header}>
				<h1><Link href='/' tabIndex='0'>Kalender</Link></h1>
				<nav>
					<button
						title='vorigen Monat'
						aria-label='vorigen Monat'
						onClick={() => {
							this.props.onChange({ relative: -1 })
						}}
					>
						{'<'}
					</button>
					<button
						title='zeige aktuellen Monat'
						onClick={() => {
							const now = new Date()
							this.props.onChange({ year: now.getFullYear(), month: now.getMonth() })
						}}
					>
						Heute
					</button>
					<button
						title='nächster Monat'
						aria-label='nächster Monat'
						onClick={() => {
							this.props.onChange({ relative: 1 })
						}}
					>
						{'>'}
					</button>
				</nav>
			</header>
		)
	}
}
