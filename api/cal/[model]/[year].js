/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

global.window = global
global.document = {
  createElement () {
    return {
      style: {}
    }
  }
}

const fs = require('fs')
const { join } = require('path')
const render = require('preact-render-to-string')
const { h } = require('preact')

const Header = require('../../../api_files/header').default
const Main = require('../../../api_files/main').default
const {
  shiftModelNames,
  shift66Name,
  shiftModelNumberOfGroups
} = require('../../../src/lib/constants')

const file = join(__dirname, '..', '..', '..', 'public', 'app-shell.html')

module.exports = async (req, res) => {
  const now = new Date()
  const today = [
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ]

  const htmlFileHandler = fs.promises.readFile(file, { encoding: 'utf-8' })

  if (Number.isNaN(req.query.year)) {
    const month = String(now.getUTCMonth()).padStart(2, '0')
    res.redirect(`./${now.getUTCFullYear()}/${month}`)
    return
  }

  const year = Number(req.query.year)
  const shiftModel = shiftModelNames.includes(req.query.model)
    ? req.query.model
    : shift66Name
  const group = !Number.isNaN(req.query.group) &&
    parseInt(req.query.group, 10) < shiftModelNumberOfGroups
    ? parseInt(req.query.group, 10)
    : 0

  const body = render(h(
    'div',
    { id: 'root' },
    h(
      'div',
      { id: 'app' },

      h(Header, {
        url: `/${shiftModel}/${year}`,
        today,
        search: null,
        group,
        shiftModel: shiftModel
      }),

      h(Main, {
        isFullYear: true,
        year,
        month: 1,
        shiftModel: shiftModel,
        today,
        search: null,
        group
      })
    )
  ))

  const htmlFile = await htmlFileHandler
  const html = htmlFile.replace('<div id="root"></div>', body)

  res.setHeader('content-type', 'text/html')
  res.send(html)
}
