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
 * @param {{ name: string, id: string }} [param.vacation] That day is a vacation day. With data.
 * @param {boolean}  param.isEditing  Is the user editing their vacations?
 * @param {boolean}  param.isSelected Is this day selected on the current edit.
 * @param {function} param.onChange   Callback when the day is changed.
 * @param {function} param.onClick   Callback when the day got clicked.
 */
export default function VacationCell ({ vacation, isEditing, isSelected, onChange, onClick }) {
  const isVacation = vacation != null
  return (
    <td className={style.vacation_cell}>
      {isEditing && !isVacation && (
        <input
          type='checkbox'
          className={formStyle.focus_outline}
          title='Ist an dem Tag Urlaub geplant?'
          checked={isSelected ?? false}
          onChange={event => {
            onChange(event.target.checked)
          }}
          data-noalert
        />
      )}
      {isVacation && (
        <button
          type='button'
          title={vacation.name}
          className={style.trans_button}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            onClick(vacation.id)
          }}
          data-noalert
        >
          🏖
        </button>
      )}
    </td>
  )
}
