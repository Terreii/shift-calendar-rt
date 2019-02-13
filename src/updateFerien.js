'use strict'

/*
 * Load Baden-Württemberg holidays from http://ferien-api.de/
 * and saves them at ./src/lib/ferien.json
 */

const fs = require('fs')
const path = require('path')
const util = require('util')
const fetch = require('node-fetch')

const writeFile = util.promisify(fs.writeFile)

fetch('https://ferien-api.de/api/v1/holidays/BW')

  .then(result => result.json())

  .then(ferien => {
    ferien.sort((a, b) => {
      if (a.start < b.start) return -1
      if (a.start > b.start) return 1
      return 0
    })

    const ferienJSON = JSON.stringify({ lastUpdate: new Date(), ferien }, null, 2) + '\n'
    const outPath = path.resolve('src', 'lib', 'ferien.json')
    return writeFile(outPath, ferienJSON)
  })

  .catch(err => {
    console.error(err)
    process.exit(1)
  })
