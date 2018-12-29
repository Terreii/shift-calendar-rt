import { h, Component } from 'preact'
import { Router } from 'preact-router'
import Hammer from 'hammerjs'

import Header from './header'
import Main from './main'

export default class App extends Component {
	constructor (args) {
		super(args)

		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth()

		this.state = {
			displayOption: 'one',
			fullYear: false,
			is6_4Model: false,
			today: [year, month, now.getDate()],
			year,
			month
		}

		this._onResize({})

		this._boundMonthChange = this._onChangeMonth.bind(this)
	}

	componentDidMount () {
		this.focusListener = this._onFocus.bind(this)
		this.resizeListener = this._onResize.bind(this)
		window.addEventListener('focus', this.focusListener)
		window.addEventListener('resize', this.resizeListener)

		this.hammertime = new Hammer(document.getElementById('app'))
		this.swipeListener = this._onSwipe.bind(this)
		this.hammertime.on('swipe', this.swipeListener)
	}

	componentWillUnmount () {
		window.removeEventListener('focus', this.focusListener)
		window.removeEventListener('resize', this.resizeListener)

		this.hammertime.off('swipe', this.swipeListener)
	}

	_onFocus (event) {
		const now = new Date()
		const today = now.getDate()

		// update today marker on refocus
		if (this.state.today[2] !== today) {
			this.setState({
				today: [now.getFullYear(), now.getMonth(), today]
			})
		}
	}

	_onResize (event) {
		const displayOption = window.innerWidth < 1220 ? 'one' : '4'

		if (displayOption !== this.state.displayOption) {
			this.setState({ displayOption })
		}
	}

	_onChangeMonth ({ year = this.state.year, month = this.state.month, relative }) {
		if (typeof relative === 'number') {
			let nextMonth = this.state.month + relative
			let nextYear = this.state.year

			if (nextMonth < 0) {
				nextYear -= 1
				nextMonth += 12
			} else if (nextMonth >= 12) {
				nextYear += 1
				nextMonth -= 12
			}

			this.setState({
				year: nextYear,
				month: nextMonth
			})
		} else {
			this.setState({ year, month })
		}
	}

	_onSwipe (event) {
		switch (event.direction) {
			case 2: // right to left
				this._onChangeMonth({ relative: 1 })
				break

			case 4: // left to right
				this._onChangeMonth({ relative: -1 })
				break

			default:
				break
		}
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url
	}

	render() {
		return (
			<div id="app">
				<Header
					year={this.state.year}
					month={this.state.month}
					onChange={this._boundMonthChange}
				/>
				<Router onChange={this.handleRoute}>
					<Main
						path='/'
						displayOption={this.state.fullYear ? 'full' : this.state.displayOption}
						year={this.state.year}
						month={this.state.month}
						is6_4Model={this.state.is6_4Model}
						today={this.state.today}
					/>
				</Router>
			</div>
		)
	}
}
