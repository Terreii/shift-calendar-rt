/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import { shiftModelText, shift66Name, shift64Name, shiftWfW } from '../../lib/constants'

import cal_6_6_group_1 from '../../assets/Schichtgruppe_1.ics'
import cal_6_6_group_2 from '../../assets/Schichtgruppe_2.ics'
import cal_6_6_group_3 from '../../assets/Schichtgruppe_3.ics'
import cal_6_6_group_4 from '../../assets/Schichtgruppe_4.ics'
import cal_6_6_group_5 from '../../assets/Schichtgruppe_5.ics'
import cal_6_6_group_6 from '../../assets/Schichtgruppe_6.ics'

import cal_6_4_group_1 from '../../assets/6-4_gruppe_1.ics'
import cal_6_4_group_2 from '../../assets/6-4_gruppe_2.ics'
import cal_6_4_group_3 from '../../assets/6-4_gruppe_3.ics'
import cal_6_4_group_4 from '../../assets/6-4_gruppe_4.ics'
import cal_6_4_group_5 from '../../assets/6-4_gruppe_5.ics'

import cal_wfw_group_1 from '../../assets/wfw_gruppe_1.ics'
import cal_wfw_group_2 from '../../assets/wfw_gruppe_2.ics'
import cal_wfw_group_3 from '../../assets/wfw_gruppe_3.ics'
import cal_wfw_group_4 from '../../assets/wfw_gruppe_4.ics'
import cal_wfw_group_5 from '../../assets/wfw_gruppe_5.ics'
import cal_wfw_group_6 from '../../assets/wfw_gruppe_6.ics'

const urls = {
  [shift66Name]: [
    cal_6_6_group_1,
    cal_6_6_group_2,
    cal_6_6_group_3,
    cal_6_6_group_4,
    cal_6_6_group_5,
    cal_6_6_group_6
  ],
  [shift64Name]: [
    cal_6_4_group_1,
    cal_6_4_group_2,
    cal_6_4_group_3,
    cal_6_4_group_4,
    cal_6_4_group_5
  ],
  [shiftWfW]: [
    cal_wfw_group_1,
    cal_wfw_group_2,
    cal_wfw_group_3,
    cal_wfw_group_4,
    cal_wfw_group_5,
    cal_wfw_group_6
  ]
}

export default ({ shiftModel }) => {
  if (!(shiftModel in urls)) {
    return <div class={style.main + ' ' + style.todo}>
      Für dieses Schichtmodell sind die Kalender noch in Arbeit
    </div>
  }

  return <div class={style.main}>
    <h4>Downloade einen {shiftModelText[shiftModel]} Kalender</h4>

    <p>Füge deine Schichtgruppe zu deiner Kalender-App hinzu!</p>

    {urls[shiftModel].map((href, index) => {
      const group = index + 1
      return <a
        key={shiftModel + group}
        class={style.link}
        href={href}
        download={`${shiftModelText[shiftModel]} - Gruppe ${group}.ics`}
      >
        Gruppe {group}
      </a>
    })}
  </div>
}
