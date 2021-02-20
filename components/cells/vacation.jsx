/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from '../../styles/calender.module.css'
import formStyle from '../../styles/form.module.css'

/**
 * Show and edit vacations for a day.
 * @param {object}   param            React argument
 * @param {boolean}  param.isEditing  Is the user editing their vacations?
 * @param {boolean}  param.isSelected Is this day selected on the current edit.
 * @param {function} param.onChange   Callback when the day is changed.
 */
export default function VacationCell ({ isEditing, isSelected, onChange }) {
  return (
    <td className={style.vacation_cell}>
      {isEditing && (
        <input
          type='checkbox'
          className={formStyle.focus_outline}
          title='Ist an dem Tag Urlaub geplant?'
          checked={isSelected}
          onChange={event => {
            onChange(event.target.checked)
          }}
          data-noalert
        />
      )}
    </td>
  )
}
