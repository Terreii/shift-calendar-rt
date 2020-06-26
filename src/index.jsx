/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, render } from 'preact'
import 'preact/devtools'

import App from './components/app.js'
import './style.css'

// register ServiceWorker only on *.now.sh (production)
if ('serviceWorker' in navigator && window.location.host.includes('.now.sh')) {
  navigator.serviceWorker.register('/sw.js')
    .then(
      event => { console.log('Service Worker registered!\nThis Web-App works offline now!') },
      error => { console.error(error) }
    )
}

render(<App />, document.getElementById('root'))
