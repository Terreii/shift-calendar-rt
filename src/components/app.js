import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Home from './home'
import Profile from './profile'

export default class App extends Component {
	constructor (args) {
		super(args)

		const now = new Date()
		this.state = {
			is6_4Model: false,
			today: [now.getFullYear(), now.getMonth(), now.getDate()],
			year: now.getFullYear(),
			month: now.getMonth()
		}
	}

	componentDidMount () {
		this.focusListener = this._onFocus.bind(this)
		window.addEventListener('focus', this.focusListener)
	}

	componentWillUnmount () {
		window.removeEventListener('focus', this.focusListener)
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
