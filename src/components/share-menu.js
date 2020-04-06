/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { html, useState, useEffect } from '../preact.js'
import qs from '../web_modules/querystringify.js'

/**
 * Display the share menu.
 * @param {object}   params            - Preact props.
 * @param {number}   params.group      - Number of selected group. 0 = no group selected/all
 * @param {number[]} [params.search]   - Searched day. [year, month, day]
 * @param {string}   params.shiftModel - Name of the selected shift-model.
 * @param {function} hide              - Hide the share menu.
 */
export default function ShareMenu ({ group, search, shiftModel, hide }) {
  const [addGroup, setAddGroup] = useState(false)
  const [addSearch, setAddSearch] = useState(false)
  const [addShiftModel, setAddShiftModel] = useState(false)

  useEffect(
    () => {
      if (group === 0 && addGroup) {
        setAddGroup(false)
      }
    },
    [group, addGroup]
  )

  useEffect(
    () => {
      if (search == null && addSearch) {
        setAddSearch(false)
      }
    },
    [search, addSearch]
  )

  const url = new URL(window.location.href)

  const props = {}

  if (addGroup && group !== 0) {
    props.group = group
  }

  if (addSearch && search != null) {
    const [year, month, date] = search
    props.search = `${year}-${month + 1}-${date}`
  }

  if (addShiftModel) {
    props.schichtmodell = shiftModel
  }

  const hash = addGroup || addSearch || addShiftModel
    ? qs.stringify(props, '#')
    : ''
  url.hash = hash

  return html`
    <div
      class=${'flex flex-col content-center items-stretch absolute top-0 left-0 ' +
        'mt-12 px-5 pt-3 pb-5 text-white bg-green-900 shadow-lg'}
    >
      <label class="flex flex-col">
        Adresse zum teilen:
        <input
          class="bg-transparent text-white pt-1"
          type="url"
          readonly
          value=${url.href}
          onFocus=${event => {
            event.target.select()
          }}
        />
      </label>

      <h6 class="mt-5 text-lg p-0 m-0 mt-2 ml-4">Füge hinzu:</h6>

      <label class="mt-5 ml-2">
        <input
          class="h-4 w-4 mr-1"
          type="checkbox"
          checked=${addShiftModel}
          onChange=${event => {
            setAddShiftModel(event.target.checked)
            if (!event.target.checked && addGroup) {
              setAddGroup(false)
            }
          }}
        />
        Schichtmodell
      </label>

      <label class="mt-5 ml-2">
        <input
          class="h-4 w-4 mr-1"
          type="checkbox"
          checked=${addGroup}
          disabled=${group === 0}
          onChange=${event => {
            if (group === 0 || group == null) return

            setAddGroup(event.target.checked)
            if (event.target.checked && !addShiftModel) {
              setAddShiftModel(true)
            }
          }}
        />
        Gruppe
        ${group === 0 && html`
          <small><br />Momentan sind alle Gruppen ausgewählt.</small>
        `}
      </label>

      <label class="mt-5 ml-2">
        <input
          class="h-4 w-4 mr-1"
          type="checkbox"
          checked=${addSearch}
          disabled=${search == null}
          onChange=${event => {
            if (search == null) return

            setAddSearch(event.target.checked)
          }}
        />
        Der gesuchte Tag
        ${search == null && html`
          <small><br />Momentan gibt es kein Suchergebnis.</small>
        `}
      </label>

      <div class="mt-5 flex flex-row flex-wrap content-center">
        <button
          class=${'flex-auto mt-5 mx-3 h-10 w-32 text-black text-center rounded bg-gray-100 ' +
            'shadow hover:bg-gray-400 active:bg-gray-400'}
          onClick=${hide}
        >
          Abbrechen
        </button>
        <a
          class=${'flex-auto mt-5 mx-3 py-2 h-10 w-32 text-white text-center rounded ' +
            'bg-purple-700 shadow hover:bg-purple-500 active:bg-purple-500'}
          href="mailto:?subject=Schichtkalender&body=Meine Schichten beim Bosch Reutlingen: ${
            url.toString().replace(/&/g, '%26')
          }"
          onClick=${event => {
            if ('share' in window.navigator) {
              event.preventDefault()

              window.navigator.share({
                url,
                title: 'Schichtkalender',
                text: 'Meine Schichten beim Bosch Reutlingen: ' + url
              })
                .then(() => { hide() })
            } else {
              setTimeout(hide, 16)
            }
          }}
        >
          Teilen
        </a>
      </div>
    </div>
  `
}
