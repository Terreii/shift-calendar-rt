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

export const dayName = [
  'So',
  'Mo',
  'Di',
  'Mi',
  'Do',
  'Fr',
  'Sa'
]

export const shiftTitle = {
  'F': 'Frühschicht\r\n6 - 14:30 Uhr',
  'S': 'Spätschicht\r\n14 - 22:30 Uhr',
  'N': 'Nachtschicht\r\n22 - 6:30 Uhr (in den nächsten Tag)',
  'K': null
}

export const shift6_6Name = '6-6'
export const shift6_4Name = '6-4'

export const shiftModelNames = [
  shift6_6Name,
  shift6_4Name
]

export const shiftModelText = {
  [shift6_6Name]: '6 - 6',
  [shift6_4Name]: '6 - 4'
}

export const shiftModelNumberOfGroups = {
  [shift6_6Name]: 6,
  [shift6_4Name]: 5
}
