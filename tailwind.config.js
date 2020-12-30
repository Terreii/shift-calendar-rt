/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/components/*.jsx',
    './src/components/**/*.jsx',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        violet: colors.violet
      },
      backgroundColor: {
        'group-1': '#ff69b4',
        'group-2': '#ff0',
        'group-3': '#f00',
        'group-4': '#0f0',
        'group-5': '#1e90ff',
        'group-6': '#cd853f'
      },
      cursor: {
        help: 'help'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    }
  },
  plugins: []
}
