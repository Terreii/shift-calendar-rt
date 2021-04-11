/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { shiftTitle, workingLongName } from '../lib/constants'

import style from './legend.module.css'

/**
 * Renders a legend of definitions for the table.
 * @returns {JSX.Element}
 */
export default function Legend () {
  return (
    <div className={style.container}>
      <dl className={style.column}>
        <Cell
          description={shiftTitle.F}
          screenReader={workingLongName.F}
        >
          F
        </Cell>

        <Cell
          description={shiftTitle.S}
          screenReader={workingLongName.S}
        >
          S
        </Cell>

        <Cell
          description={shiftTitle.N}
          screenReader={workingLongName.N}
        >
          N
        </Cell>
      </dl>

      <dl className={style.column}>
        <Cell
          className={style.holiday}
          description='Schulferien / Feiertage in Baden-Württemberg'
          screenReader='Zelle mit einem Blaugrün Hintergrund'
        />

        <Cell
          className={style.closing}
          description='Schließtage (Ostern und Weihnachten)'
          screenReader='Zelle mit einem Dunkelgrünen Hintergrund'
        />

        <Cell
          className={style.ramadan}
          description='Ramadan (erster oder letzter Fastentag)'
          screenReader='Zelle mit einem Cyan Hintergrund'
        />

        <Cell
          className={style.daylight_saving}
          description='Zeitumstellung'
          screenReader='Zelle mit einem Gelben Hintergrund und einem dicken Roten Rahmen'
        />
      </dl>
    </div>
  )
}

/**
 * Legend of a cell for the table.
 * @param {Object} param  React params.
 * @param {string} [param.className]     ClassName of the example cell.
 * @param {string} param.description     Description of the cell shown.
 * @param {string} param.screenReader    Content for screen readers.
 * @param {JSX.Element} [param.children] Content of the example cell.
 * @returns {JSX.Element}
 */
function Cell ({ className, description, screenReader, children }) {
  return (
    <>
      <dt className={className ? `${style.cell} ${className}` : style.cell}>
        <span className='sr-only'>{screenReader}</span>
        <span aria-hidden>{children || '1'}</span>
      </dt>

      <dd className={style.definition}>
        {description}
      </dd>
    </>
  )
}
