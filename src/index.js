/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { html, render } from './preact.js'

import App from './components/app.js'

// register ServiceWorker via OfflinePlugin, for prod only:
if (globalThis.process && process.env && process.env.NODE_ENV === 'production') {
  require('./pwa')
}

render(html`<${App} />`, document.body)
