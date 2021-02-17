/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { createSlice, createSelector } from '@reduxjs/toolkit'

/**
 * VacationDay
 * @typedef {Object} VacationDay
 * @property {number} year       Year in which this vacation day is.
 * @property {number} month      Month in which this vacation day is.
 * @property {number} day        Day in month in which this vacation day is.
 */

const vacationSlice = createSlice({
  name: 'vacation',
  initialState: {
    isEditing: false,
    _id: null,
    name: '',
    note: '',
    days: []
  },

  reducers: {
    startEdit (state, action) {
      state.isEditing = true
      state._id = 'new'
      state.name = ''
      state.note = ''
      state.days = []
    },

    endEdit (state, action) {
      state.isEditing = false
      state._id = null
      state.name = ''
      state.note = ''
      state.days = []
    },

    loaded (state, action) {
      state.isEditing = false
      state._id = action.payload._id
      state.name = action.payload.name
      state.note = action.payload.note
      state.days = action.payload.days
    },

    setName (state, action) {
      state.name = action.payload
    },

    setNote (state, action) {
      state.note = action.payload
    },

    addDay: {
      reducer (state, action) {
        if (
          typeof action.payload.year === 'number' &&
          typeof action.payload.month === 'number' &&
          action.payload.month > 0 &&
          action.payload.month <= 12 &&
          typeof action.payload.day === 'number' &&
          action.payload.day > 0 &&
          action.payload.day <= 31
        ) {
          state.days.push(action.payload)
        }
      },

      /**
       * Add a vacation day.
       * @param {number} year  Year of the vacation.
       * @param {number} month Month of the vacation.
       * @param {number} day   Day in month of the vacation day.
       */
      prepare (year, month, day) {
        return {
          payload: {
            year,
            month,
            day
          }
        }
      }
    },

    removeDay: {
      reducer (state, action) {
        const index = state.days.findIndex(day => (
          day.year === action.payload.year &&
          day.month === action.payload.month &&
          day.day === action.payload.day
        ))

        if (index >= 0) {
          state.days.splice(index, 1)
        }
      },

      /**
       * Remove a vacation day.
       * @param {number} year  Year of the vacation.
       * @param {number} month Month of the vacation.
       * @param {number} day   Day in month of the vacation day.
       */
      prepare (year, month, day) {
        return {
          payload: {
            year,
            month,
            day
          }
        }
      }
    }
  }
})

export default vacationSlice.reducer

export const {
  startEdit,
  endEdit,
  loaded,
  setName,
  setNote,
  addDay,
  removeDay
} = vacationSlice.actions

/**
 * Is a vacation being added?
 * @param {any} state State of the redux store
 * @returns {boolean}
 */
export function selectIsEditing (state) {
  return state.vacation.isEditing
}

export function selectVacationState (state) {
  return state.vacation
}

/**
 * Select the _id of the vacation.
 * @param {any} state State of the redux store
 * @returns {string}
 */
export function selectId (state) {
  return selectVacationState(state)._id
}

/**
 * Select the name of the vacation.
 * @param {any} state State of the redux store
 * @returns {string}
 */
export function selectName (state) {
  return selectVacationState(state).name
}

/**
 * Select the note for that vacation.
 * @param {any} state State of the redux store
 * @returns {string}
 */
export function selectNote (state) {
  return selectVacationState(state).note
}

/**
 * Select the days of that vacation.
 * @param {any} state State of the redux store
 * @returns {VacationDay[]}
 */
export function selectDays (state) {
  return selectVacationState(state).days
}

export const selectVacation = createSelector(
  selectId,
  selectName,
  selectNote,
  selectDays,
  (id, name, note, days) => {
    return {
      _id: id,
      type: 'vacation',
      name,
      note,
      days
    }
  }
)

// Actions

export function doLoad (id) {
  return async (dispatch, getState, { db }) => {
    const doc = await db.get(id)
    dispatch(loaded(doc))
  }
}

export function doSave () {
  return async (dispatch, getState, { db }) => {
    const vac = selectVacation(getState())

    if (vac._id === 'new') {
      delete vac._id
      const result = await db.post(vac)
      const doc = await db.get(result.id)

      dispatch(loaded(doc))
    } else if ((vac._id?.length ?? 0) > 0) {
      const doc = await db.get(vac._id)

      if (
        vac.name !== doc.name ||
        vac.note !== doc.note ||
        JSON.stringify(vac.days) !== JSON.stringify(doc.days)
      ) {
        const result = await db.put({
          ...doc,
          ...vac
        })
        const updated = await db.get(result.id)
        dispatch(loaded(updated))
      } else {
        dispatch(endEdit())
      }
    } else {
      dispatch(endEdit())
    }
  }
}
