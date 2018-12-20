import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Home from './home'
import Profile from './profile'

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
	}

	componentDidMount () {
		this.focusListener = this._onFocus.bind(this)
		this.resizeListener = this._onResize.bind(this)
		window.addEventListener('focus', this.focusListener)
		window.addEventListener('resize', this.resizeListener)
	}

	componentWillUnmount () {
		window.removeEventListener('focus', this.focusListener)
		window.removeEventListener('resize', this.resizeListener)
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
				<Header />
				<Router onChange={this.handleRoute}>
					<Home
						path='/'
						displayOption={this.state.fullYear ? 'full' : this.state.displayOption}
						year={this.state.year}
						month={this.state.month}
						is6_4Model={this.state.is6_4Model}
						today={this.state.today}
					/>
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
			</div>
		)
	}
}
