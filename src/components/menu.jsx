/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h } from 'preact'

import {
  monthNames,
  shiftModelNames,
  shiftModelText,
  shiftModelNumberOfGroups
} from '../lib/constants.js'

const [supportsMonthInput, supportsDateInput] = ['month', 'date'].map(type => {
  const parent = document.createElement('div')
  const input = document.createElement('input')
  input.type = type
  parent.appendChild(input)
  return parent.firstChild.type === type
})

export default function Menu ({
  show,
  month,
  year,
  isFullYear,
  search,
  group,
  shiftModel,
  toggleFullYear,
  gotoMonth,
  dispatch,
  onShare
}) {
  let searchValue = ''
  if (search != null) {
    const searchMonth = String(search[1] + 1).padStart(2, '0')
    const searchDay = String(search[2]).padStart(2, '0')
    searchValue = `${search[0]}-${searchMonth}-${searchDay}`
  }

  const groupOptions = []
  for (let gr = 1, max = shiftModelNumberOfGroups[shiftModel] || 1; gr <= max; gr += 1) {
    groupOptions.push(<option key={'group_' + gr} value={gr}>Nur Gruppe {gr}</option>)
  }

  return (
    <div
      id='hamburger_menu'
      aria-live='polite'
      aria-label='Menü'
      class={
        (show ? 'flex' : 'hidden') + ' absolute top-0 right-0 mt-12 p-3 ' +
      ' flex-col justify-center items-stretch bg-green-900 shadow-lg'
      }
    >
      {supportsMonthInput || isFullYear
        ? null
        : (
          <select
            class='form-item'
            title='Gehe zum Monat'
            value={month}
            onChange={event => {
              gotoMonth({ type: 'goto', month: +event.target.value, fullYear: false }, true)
            }}
            aria-controls='calendar_main_out'
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>
        )}

      {(!supportsMonthInput || isFullYear) && (
        <label class='mt-5 flex flex-col items-stretch text-white text-center'>
          Jahr
          <input
            class='flex-auto mt-1 w-full form-item'
            type='number'
            min='2000'
            aria-controls='calendar_main_out'
            value={year}
            onChange={event => {
              const year = +event.target.value

              if (Number.isNaN(year)) {
                event.target.value = String(event.target.value).replace(/\D/g, '')
                return
              }

              gotoMonth({ type: 'goto', year, fullYear: isFullYear }, false)
            }}
          />
        </label>
      )}

      {supportsMonthInput && !isFullYear && (
        <label class='mt-5 flex flex-col items-stretch text-white text-center'>
          Gehe zum Monat
          <input
            class='flex-auto mt-1 w-full form-item'
            type='month'
            aria-controls='calendar_main_out'
            min='2000-01'
            value={`${year}-${String(month + 1).padStart(2, '0')}`}
            onChange={event => {
              const value = event.target.value
              if (value == null || value.length === 0) {
                gotoMonth({ type: 'goto', year, month })
                return
              }

              const [nextYear, nextMonth] = value.split('-').map(s => parseInt(s, 10))

              if (Number.isNaN(nextYear) || Number.isNaN(nextMonth)) {
                gotoMonth({ type: 'goto', year, month })
                return
              }

              gotoMonth({
                type: 'goto',
                year: nextYear,
                month: nextMonth - 1,
                fullYear: isFullYear
              }, false)
            }}
          />
        </label>
      )}

      {supportsDateInput && (
        <label class='mt-5 flex flex-col items-stretch text-white text-center'>
          Suche einen Tag
          <input
            class='flex-auto mt-1 w-full form-item'
            type='date'
            aria-controls='calendar_main_out'
            min='2000-01-01'
            value={searchValue}
            onChange={event => {
              const value = event.target.value

              if (value == null || value.length === 0) {
                dispatch({ type: 'clear_search' })
              } else {
                const date = new Date(value)
                dispatch({
                  type: 'search',
                  year: date.getFullYear(),
                  month: date.getMonth(),
                  day: date.getDate()
                })
              }
            }}
          />
        </label>
      )}

      <button
        type='button'
        class='mt-5 form-item'
        onClick={toggleFullYear}
        aria-controls='calendar_main_out'
      >
        Zeige {isFullYear ? 'Monate' : 'ganzes Jahr'}
      </button>

      <label class='mt-5 flex flex-col items-stretch text-white text-center'>
        Schichtmodell
        <select
          class={'flex-auto mt-1 h-10 w-full text-black text-center rounded bg-gray-100 shadow ' +
          'hover:bg-gray-400 active:bg-gray-400 focus:shadow-outline focus:outline-none'}
          aria-controls='calendar_main_out'
          value={shiftModel}
          onChange={event => {
            dispatch({
              type: 'model_change',
              payload: event.target.value
            })
          }}
        >
          {shiftModelNames.map(model => (
            <option key={model} value={model}>
              {shiftModelText[model] || model}
            </option>
          ))}
        </select>
      </label>

      <select
        class={'mt-5 h-10 text-black text-center rounded bg-gray-100 shadow ' +
        'hover:bg-gray-400 active:bg-gray-400 focus:shadow-outline focus:outline-none'}
        aria-controls='calendar_main_out'
        aria-label='Schichtgruppen'
        value={group}
        onChange={event => {
          const group = +event.target.value
          dispatch({
            type: 'group_change',
            payload: group
          })
        }}
      >
        <option value='0'>Alle Gruppen</option>
        {groupOptions}
      </select>

      <button
        type='button'
        class={'mt-5 mx-auto py-2 px-4 h-12 text-black text-center rounded bg-gray-100 shadow ' +
        'hover:bg-gray-400 active:bg-gray-400 focus:shadow-outline focus:outline-none'}
        onClick={onShare}
        aria-label='Teile deine Schicht'
      >
        <img src='/assets/icons/share21.svg' height='32' width='32' alt='teilen' />
      </button>
    </div>
  )
}
