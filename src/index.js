/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, render } from 'preact'
import './style'

let root
function init () {
  let App = require('./components/app').default
  root = render(<App />, document.body, root)
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

// in development, set up HMR:
if (module.hot) {
  // require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', () => window.requestAnimationFrame(init))
}

init()
