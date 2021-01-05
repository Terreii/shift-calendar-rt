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
const esbuild = require('esbuild')

const projectDir = join(__dirname, '..', '..', '..', '..')
const headerFile = join(projectDir, 'src', 'components', 'header.jsx')
const mainFile = join(projectDir, 'src', 'components', 'main.jsx')
const apiFiles = join(projectDir, 'api_files')
const headerBuildFile = join(projectDir, 'api_files', 'header.js')
const mainBuildFile = join(projectDir, 'api_files', 'main.js')
const { shiftModelNames, shift66Name } = require('../../../../src/lib/constants')

const file = join(projectDir, 'public', 'app-shell.html')

let Header
let Main

try {
  Header = require(headerBuildFile).default
  Main = require(mainBuildFile).default
} catch (err) {
  esbuild.buildSync({
    entryPoints: [headerFile, mainFile],
    bundle: true,
    outdir: apiFiles,
    platform: 'node',
    target: 'node12',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    external: ['preact']
  })
  Header = require(headerBuildFile).default
  FirstRun = require(mainBuildFile).default
}

module.exports = async (req, res) => {
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
