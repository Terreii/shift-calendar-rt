import fs from 'fs'
import { join } from 'path'
import render from 'preact-render-to-string'
import { h } from 'preact'
import { NowRequest, NowResponse } from '@vercel/node'

const Header = require('../../src/components/header')
const FirstRun = require('../../src/components/first-run')

const file = join(__dirname, '..', '..', 'public', 'app-shell.html')

export default async (_req: NowRequest, res: NowResponse) => {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()

  const htmlFileHandler = fs.promises.readFile(file, { encoding: 'utf-8' })

  const body = render(h(
    'div',
    { id: 'root' },
    h(
      'div',
      { id: 'app' },

      h(Header, {
        url: '',
        year,
        month,
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
