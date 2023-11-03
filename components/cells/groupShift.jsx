/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from "../../styles/calendar.module.css";

/**
 * Render a cell that displays if that shift group is working and what shift.
 * @param {object}          param                 React arguments.
 * @param {number}          param.group           Number of group. Group 1 is 0.
 * @param {"F"|"S"|"N"|"K"} param.shift           Shift data.
 */
export default function GroupShiftCell({ group, shift }) {
  if (shift === "K") {
    return <td className={style.group} />;
  }

  return (
    <td
      className={style.group}
      data-group={group + 1}
      aria-describedby={shift + "_description"}
    >
      {shift}
    </td>
  );
}
