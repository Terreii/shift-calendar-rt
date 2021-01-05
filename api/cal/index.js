const fs = require('fs')
const { join } = require('path')
const render = require('preact-render-to-string')
const { h } = require('preact')
const esbuild = require('esbuild')

const file = join(__dirname, '..', '..', 'public', 'app-shell.html')
const headerFile = join(__dirname, '..', '..', 'src', 'components', 'header.jsx')
const firstRunFile = join(__dirname, '..', '..', 'src', 'components', 'first-run.jsx')
const apiFiles = join(__dirname, '..', '..', 'api_files')
const headerBuildFile = join(__dirname, '..', '..', 'api_files', 'header.js')
const firstRunBuildFile = join(__dirname, '..', '..', 'api_files', 'first-run.js')

let Header
let FirstRun

try {
  Header = require(headerBuildFile).default
  FirstRun = require(firstRunBuildFile).default
} catch (err) {
  esbuild.buildSync({
    entryPoints: [headerFile, firstRunFile],
    bundle: true,
    outdir: apiFiles,
    platform: 'node',
    target: 'node12',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    external: ['preact']
  })
  Header = require(headerBuildFile).default
  FirstRun = require(firstRunBuildFile).default
}

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
