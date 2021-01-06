/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

const fs = require('fs')
const { join } = require('path')
const render = require('preact-render-to-string')
const { h } = require('preact')

const Header = require('../../api_files/header').default
const FirstRun = require('../../api_files/first-run').default
const file = join(__dirname, '..', '..', 'public', 'app-shell.html')

module.exports = async (req, res) => {
  const now = new Date()
  const today = [
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ]

  const htmlFileHandler = fs.promises.readFile(file, { encoding: 'utf-8' })

  const body = render(h(
    'div',
    { id: 'root' },
    h(
      'div',
      { id: 'app' },

      h(Header, {
        url: '',
        today,
        search: null,
        group: 0,
        shiftModel: '',
        dispatch: () => {}
      }),

      h(FirstRun, {
        onClick: () => {}
      })
    )
  ))

  const htmlFile = await htmlFileHandler
  const html = htmlFile.replace('<div id="root"></div>', body)

  res.setHeader('content-type', 'text/html')
  res.send(html)
}
