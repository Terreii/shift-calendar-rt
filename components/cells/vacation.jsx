/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState } from 'react'

import style from '../../styles/calender.module.css'
import formStyle from '../../styles/form.module.css'

/**
 * Show and edit vacations for a day.
 * @param {object}   param            React argument
 * @param {boolean}  param.isEditing  Is the user editing their vacations?
 */
export default function VacationCell ({ isEditing }) {
  const [checked, setChecked] = useState(false)
  return (
    <td className={style.vacation_cell}>
      {isEditing && (
        <input
          type='checkbox'
          className={formStyle.focus_outline}
          title='Ist an dem Tag Urlaub geplant?'
          checked={checked}
          onChange={event => {
            setChecked(event.target.checked)
          }}
          data-noalert
        />
      )}
    </td>
  )
}
