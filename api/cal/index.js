const fs = require('fs')
const { join } = require('path')
const render = require('preact-render-to-string')
const { h } = require('preact')

const Header = require('../../api_files/header').default
const FirstRun = require('../../api_files/first-run').default

const file = join(__dirname, '..', '..', 'build', 'app-shell.html')

module.exports = async (req, res) => {
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
