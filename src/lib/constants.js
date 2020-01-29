/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export const monthNames = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
]

export const shiftTitle = {
  'F': 'Frühschicht\r\n6 - 14:30 Uhr',
  'S': 'Spätschicht\r\n14 - 22:30 Uhr',
  'N': 'Nachtschicht\r\n22 - 6:30 Uhr (in den nächsten Tag)',
  'K': null
}

export const shift66Name = '6-6'
export const shift64Name = '6-4'
export const shiftWfW = 'wfw'
export const shiftAddedNight = 'added-night'
export const shiftAddedNight8 = 'added-night-8'

export const shiftModelNames = [
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight,
  shiftAddedNight8
]

export const shiftModelText = {
  [shift66Name]: '6 - 6 Kontischicht',
  [shift64Name]: '6 - 4 Kontischicht',
  [shiftWfW]: 'Werkfeuerwehr',
  [shiftAddedNight]: 'aufgesetzte Nachtarbeit',
  [shiftAddedNight8]: 'aufgesetzte Nachtarbeit 8 Wochen'
}

export const shiftModelNumberOfGroups = {
  [shift66Name]: 6,
  [shift64Name]: 5,
  [shiftWfW]: 6,
  [shiftAddedNight]: 3,
  [shiftAddedNight8]: 3
}
