/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from './web_modules/preact.js'
import htm from './web_modules/htm.js'

export * from './web_modules/preact.js'
export * from './web_modules/preact/hooks.js'

export const html = htm.bind(h)
