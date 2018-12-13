import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Home from './home'
import Profile from './profile'

import getMonthData from '../lib/workdata'

export default class App extends Component {
	constructor (args) {
		super(args)

		const now = new Date()
		this.state = {
			year: now.getFullYear(),
			month: now.getMonth()
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
						data={getMonthData(this.state.year, this.state.month)}
					/>
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
			</div>
		)
	}
}
