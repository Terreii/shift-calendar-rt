/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, render } from 'preact'
import 'preact/devtools'

import App from './components/app.js'
import './style.css'

render(<App />, document.getElementById('root'))
