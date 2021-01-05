import fs from 'fs'
import { join } from 'path'
import render from 'preact-render-to-string'
import { h } from 'preact'
import { NowRequest, NowResponse } from '@vercel/node'

import Header from '../../../../src/components/header'
import Main from '../../../../src/components/header'
import { shiftModelNames, shift66Name } from '../../../../src/lib/constants'

const file = join(__dirname, '..', '..', '..', '..', 'public', 'app-shell.html')

export default async (req: NowRequest, res: NowResponse) => {
  const now = new Date()

  const htmlFileHandler = fs.promises.readFile(file, { encoding: 'utf-8' })

  const requestedMonth = new Date(now.getTime())
  requestedMonth.setUTCFullYear(Number(req.query.year))
  const parsedMonth = Number(req.query.month)
  const monthNum = Math.max(Math.min(parsedMonth, 12), 1)
  requestedMonth.setUTCMonth(monthNum - 1)

  const year = requestedMonth.getUTCFullYear()
  const month = requestedMonth.getUTCMonth()
  const shiftModel = shiftModelNames.includes(req.query.model)
    ? req.query.model
    : shift66Name

  const body = render(h(
    'div',
    { id: 'root' },
    h(
      'div',
      { id: 'app' },

      h(Header, {
        url: `/${shiftModel}/${year}/${month}`,
        year,
        month,
        search: null,
        group: 0,
        shiftModel: shiftModel,
        dispatch: () => {}
      }),

      h(Main, {
        isFullYear: false,
        year,
        month,
        shiftModel: shiftModel,
        today: [
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate()
        ],
        search: null,
        group: 0,
        dispatch: () => {}
      })
    )
  ))

  const htmlFile = await htmlFileHandler
  const html = htmlFile.replace('<div id="root"></div>', body)

  res.setHeader('content-type', 'text/html')
  res.send(html)
}
