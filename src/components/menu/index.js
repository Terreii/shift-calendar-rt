/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'
import style from './style.less'

import { monthNames } from '../../lib/constants'

const [supportsMonthInput, supportsDateInput] = ['month', 'date'].map(type => {
  const parent = document.createElement('div')
  const input = document.createElement('input')
  input.type = type
  parent.appendChild(input)
  return parent.firstChild.type === type
})

export default ({
  show,
  month,
  year,
  isFullYear,
  search,
  group,
  toggleFullYear,
  gotoMonth,
  onSearch,
  onGroupChange,
  onShare
}) => {
  let searchValue = ''
  if (search != null) {
    const searchMonth = String(search[1] + 1).padStart(2, '0')
    const searchDay = String(search[2]).padStart(2, '0')
    searchValue = `${search[0]}-${searchMonth}-${searchDay}`
  }

  let groupOptions = []
  for (let gr = 1; gr <= 6; gr += 1) {
    groupOptions.push(<option key={'group_' + gr} value={gr}>Nur Gruppe {gr}</option>)
  }

  return <div class={show ? style.Show : style.Menu}>
    {supportsMonthInput || isFullYear
      ? null
      : <select
        title='Gehe zum Monat'
        value={month}
        onChange={event => {
          gotoMonth({ month: +event.target.value, toggleFullYear: true }, true)
        }}
      >
        {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
      </select>
    }

    {!supportsMonthInput || isFullYear
      ? <label>
        Jahr
        <input
          type='number'
          min='2000'
          value={year}
          onChange={event => {
            const year = +event.target.value

            if (Number.isNaN(year)) {
              event.target.value = String(event.target.value).replace(/\D/g, '')
              return
            }

            gotoMonth({ year, toggleFullYear: !isFullYear }, false)
          }}
        />
      </label>
      : null
    }

    {supportsMonthInput && !isFullYear
      ? <label>
        Gehe zum Monat
        <input
          type='month'
          min='2000-01'
          value={`${year}-${String(month + 1).padStart(2, '0')}`}
          onChange={event => {
            const value = event.target.value
            if (value == null || value.length === 0) {
              gotoMonth({ year, month })
              return
            }

            const [nextYear, nextMonth] = value.split('-').map(s => parseInt(s, 10))

            if (Number.isNaN(nextYear) || Number.isNaN(nextMonth)) {
              gotoMonth({ year, month })
              return
            }

            gotoMonth({ year: nextYear, month: nextMonth - 1, toggleFullYear: true }, false)
          }}
        />
      </label>
      : null
    }

    {supportsDateInput
      ? <label>
        Suche einen Tag
        <input
          type='date'
          min='2000-01-01'
          value={searchValue}
          onChange={event => {
            const value = event.target.value

            if (value == null || value.length === 0) {
              onSearch(false)
            } else {
              const date = new Date(value)
              onSearch(true, date.getFullYear(), date.getMonth(), date.getDate())
            }
          }}
        />
      </label>
      : null
    }

    <button onClick={toggleFullYear}>
      Zeige {isFullYear ? 'Monate' : 'ganzes Jahr'}
    </button>

    <select
      value={group}
      onChange={event => {
        const group = +event.target.value
        onGroupChange(group)
      }}
    >
      <option value='0'>Alle Gruppen</option>
      {groupOptions}
    </select>

    <button class={style.share} onClick={onShare}>
      <img
        src='/assets/icons/share21.svg'
        height='32'
        width='32'
        alt='teilen'
      />
    </button>
  </div>
}
