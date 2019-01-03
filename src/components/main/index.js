import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style.less'

import Month from '../month'
import selectMonthData from '../../lib/select-month-data'

export default ({ displayOption, year, month, is6_4Model, today }) => {
	let monthsData = []

	switch (displayOption) {
		case 'full':
			for (let i = 0; i < 12; ++i) {
				monthsData.push({
					year,
					month: i,
					data: selectMonthData(year, i, is6_4Model)
				})
			}
			break

		case '4':
			for (let i = 0; i < 4; ++i) {
				let monthNr = month + (i - 1)
				let yearNr = year

				if (monthNr > 11) {
					monthNr -= 12
					yearNr += 1
				} else if (monthNr < 0) {
					monthNr += 12
					yearNr -= 1
				}

				monthsData.push({
					year: yearNr,
					month: monthNr,
					data: selectMonthData(yearNr, monthNr, is6_4Model)
				})
			}
			break
	
		case 'one':
		default:
			monthsData.push({
				year,
				month,
				data: selectMonthData(year, month, is6_4Model)
			})
			break
	}

	return (
		<div class={style.MainContainer}>
			<div class={style.home} onClick={processClick}>
				{monthsData.map(({year, month, data}) => <Month
					key={`${year}-${month}-${is6_4Model}`}
					year={year}
					month={month}
					data={data}
					today={today[0] === year && today[1] === month ? today : null}
					is6_4Model={is6_4Model}
				/>)}
			</div>
			<Link
				class={style.ImpressumLink}
				href='/impressum/'
				tabIndex='0'
				onClick={() => {
					window.scrollTo(0, 0)
				}}
			>
				Impressum
			</Link>
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
