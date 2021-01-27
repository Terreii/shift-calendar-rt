/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useMemo } from 'react'

import { getCalUrl } from '../lib/utils'

/**
 * Display the share menu.
 * @param {object}   params            - Preact props.
 * @param {number}   params.group      - Number of selected group. 0 = no group selected/all
 * @param {number}   [params.year]     - Searched day's year.
 * @param {number}   [params.month]    - Searched day's month.
 * @param {number}   [params.search]   - Searched day.
 * @param {string}   params.shiftModel - Name of the selected shift-model.
 * @param {function} hide              - Hide the share menu.
 */
export default function ShareMenu ({ group, year, month, search, shiftModel, hide }) {
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

  useEffect(() => {
    document.getElementById('share_url').focus()
    return () => {
      const element = document.getElementById('menu_summary')
      if (element) {
        element.focus()
      }
    }
  }, [])

  const url = useMemo(() => {
    try {
      const url = new URL('/', window.location.href)

      if (addShiftModel) {
        url.pathname = getCalUrl({
          shiftModel,
          isFullYear: false,
          year: addSearch ? year : null,
          month: addSearch ? month : null
        })

        if (addSearch && search != null) {
          url.searchParams.set('search', search)
        }
        if (addGroup && group > 0) {
          url.searchParams.set('group', group)
        }
      }

      return url
    } catch (err) {
      return ''
    }
  }, [year, month, addGroup, group, addSearch, search, addShiftModel, shiftModel])

  return (
    <div
      id='share_menu'
      className='absolute top-0 right-0 flex flex-col items-stretch content-center px-5 pt-3 pb-5 mt-12 text-white bg-green-900 shadow-lg'
    >
      <label className='flex flex-col'>
        Adresse zum teilen:
        <input
          id='share_url'
          className='pt-1 text-white bg-transparent focus:ring focus:outline-none'
          type='url'
          readOnly
          value={url.href}
          onFocus={event => {
            event.target.select()
          }}
        />
      </label>

      <h6 className='p-0 m-0 mt-5 ml-4 text-lg'>Füge hinzu:</h6>

      <label className='mt-5 ml-2'>
        <input
          className='w-4 h-4 mr-1 focus:ring focus:outline-none'
          type='checkbox'
          checked={addShiftModel}
          onChange={event => {
            setAddShiftModel(event.target.checked)
            if (!event.target.checked && addGroup) {
              setAddGroup(false)
            }
            if (!event.target.checked && addSearch) {
              setAddSearch(false)
            }
          }}
        />
        Schichtmodell
      </label>

      <label className='mt-5 ml-2'>
        <input
          className='w-4 h-4 mr-1 focus:ring focus:outline-none'
          type='checkbox'
          checked={addGroup}
          disabled={group === 0}
          onChange={event => {
            if (group === 0 || group == null) return

            setAddGroup(event.target.checked)
            if (event.target.checked && !addShiftModel) {
              setAddShiftModel(true)
            }
          }}
        />
        Gruppe
        {group === 0 && (
          <small><br />Momentan sind alle Gruppen ausgewählt.</small>
        )}
      </label>

      <label className='mt-5 ml-2'>
        <input
          className='w-4 h-4 mr-1 focus:ring focus:outline-none'
          type='checkbox'
          checked={addSearch}
          disabled={search == null}
          onChange={event => {
            if (search == null) return

            setAddSearch(event.target.checked)
            if (event.target.checked && !addShiftModel) {
              setAddShiftModel(true)
            }
          }}
        />
        Der gesuchte Tag
        {search == null && (
          <small><br />Momentan gibt es kein Suchergebnis.</small>
        )}
      </label>

      <div className='flex flex-row flex-wrap content-center mt-5'>
        <button
          type='button'
          className='flex-auto w-32 mx-3 mt-5 form-item'
          onClick={hide}
        >
          Abbrechen
        </button>
        {'navigator' in globalThis && ('share' in window.navigator) // eslint-disable-line
          ? (
            <button
              type='button'
              className='flex-auto w-32 py-2 mx-3 mt-5 text-white bg-purple-700 hover:bg-purple-500 active:bg-purple-500 form-item'
              onClick={event => {
                event.preventDefault()

                window.navigator.share({
                  url,
                  title: 'Schichtkalender',
                  text: 'Meine Schichten beim Bosch Reutlingen: ' + url
                })
                  .then(() => { hide() })
              }}
            >
              Teilen
            </button>
          )
          : (
            <a
              className='flex-auto w-32 py-2 mx-3 mt-5 text-white bg-purple-700 hover:bg-purple-500 active:bg-purple-500 form-item'
              href={`mailto:?subject=Schichtkalender&body=Meine Schichten beim Bosch Reutlingen: ${
                url.toString().replace(/&/g, '%26')
              }`}
              onClick={() => {
                setTimeout(hide, 16)
              }}
            >
              Teilen
            </a>
          )}
      </div>
    </div>
  )
}
