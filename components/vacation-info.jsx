/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  selectIsEditing,
  selectId,
  selectName,
  selectNote,
  startEdit,
  setName,
  setNote,
  endEdit,
  doSave
} from '../lib/reducers/vacation'

import style from './vacation-info.module.css'
import formStyle from '../styles/form.module.css'

export default function VacationInfo () {
  const dispatch = useDispatch()

  const isEditing = useSelector(selectIsEditing)
  const id = useSelector(selectId)
  const name = useSelector(selectName)
  const note = useSelector(selectNote)

  if (!isEditing && id == null) {
    return null
  }

  if (!isEditing) {
    return (
      <aside className={style.container}>
        <h2 className={style.header}>{name}</h2>

        {note.length > 0 && (
          <p className={style.text}>
            {note.split('\n').map((line, index) => (
              <Fragment key={index}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        )}

        <form
          className={style.buttons_row}
          onSubmit={event => {
            dispatch(startEdit())
          }}
        >
          <button type='submit' className={formStyle.accept_button}>
            Bearbeiten
          </button>

          <button
            type='reset'
            className={formStyle.cancel_button}
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              dispatch(endEdit())
            }}
          >
            Schließen
          </button>
        </form>
      </aside>
    )
  }

  return (
    <aside className={style.container}>
      <h2 className={style.header}>Urlaub {id === 'new' ? 'hinzufügen' : 'bearbeiten'}</h2>

      <form
        className={style.form}
        onSubmit={event => {
          event.preventDefault()
          dispatch(doSave())
        }}
      >
        <label className={style.item}>
          <span className={style.label}>Name</span>
          <input
            className={style.input}
            type='text'
            name='name'
            value={name}
            onChange={event => {
              dispatch(setName(event.target.value))
            }}
          />
        </label>

        <label className={style.item}>
          <span className={style.label}>Notiz</span>
          <textarea
            className={style.input}
            name='note'
            rows='3'
            cols='20'
            value={note}
            onChange={event => {
              dispatch(setNote(event.target.value))
            }}
          />
        </label>

        <div className={style.buttons_row}>
          <button type='submit' className={formStyle.accept_button}>
            Speichern
          </button>

          <button
            type='reset'
            className={formStyle.cancel_button}
            onClick={event => {
              event.preventDefault()
              dispatch(endEdit())
            }}
          >
            Abbrechen
          </button>
        </div>
      </form>
    </aside>
  )
}
