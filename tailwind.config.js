/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

module.exports = {
  purge: [
    './src/components/*.js',
    './src/components/**/*.js',
    './src/index.html'
  ],
  theme: {
    extend: {
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
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover']
  },
  plugins: []
}
