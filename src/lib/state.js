import { useReducer, useEffect } from 'preact/hooks'
import qs from 'querystringify'

import {
  shiftModelNames,
  shift66Name,
  shiftModelNumberOfGroups
} from '../lib/constants.js'

const initialState = {
  url: window.location.pathname,
  didSelectModel: false, // did the user select a shift-model once?
  fullYear: false, // should the full year be displayed
  shiftModel: shift66Name, // Which shift-model is it, the 6-4 model or the 6-6 model?
  search: null,
  year: 2020, // Selected year
  month: 1, // Selected month
  group: 0 // group to display; 0 = all, 1 - 6 is group number
}

export default function useStateReducer () {
  const [state, dispatch] = useReducer(reducer, initialState, initReducer)

  useEffect(() => {
    window.localStorage.setItem('settings', JSON.stringify({
      didSelectModel: state.didSelectModel,
      group: state.group,
      shiftModel: state.shiftModel
    }))
  }, [state.didSelectModel, state.group, state.shiftModel])

  return [state, dispatch]
}

/**
 * Load the stored settings from localStorage or the share hash.
 * And sets year and month to today.
 * @param {object} initialState The initial Reducer state
 */
function initReducer (initialState) {
  const now = new Date()

  const state = {
    ...initialState,
    year: now.getFullYear(),
    month: now.getMonth()
  }

  // load the stored settings
  const storedSettings = JSON.parse(window.localStorage.getItem('settings') || '{}')

  if (storedSettings.didSelectModel != null) {
    state.didSelectModel = storedSettings.didSelectModel
  }
  if (typeof storedSettings.group === 'number') {
    state.group = storedSettings.group
  }
  if (storedSettings.shiftModel != null && shiftModelNames.includes(storedSettings.shiftModel)) {
    state.shiftModel = storedSettings.shiftModel
  }

  // Load the settings from the share hash
  if (window.location.hash.length > 1) {
    const hashSettings = qs.parse(window.location.hash.slice(1))

    const group = +hashSettings.group
    if (!Number.isNaN(group) && group > 0 && group <= 6) {
      state.group = group
    }

    const schichtmodell = hashSettings.schichtmodell
    if (schichtmodell != null && shiftModelNames.includes(schichtmodell)) {
      state.shiftModel = schichtmodell
      state.didSelectModel = true

      if (state.group > shiftModelNumberOfGroups[schichtmodell]) {
        state.group = 0
      }
    }

    if (hashSettings.search != null && hashSettings.search.length >= 8) {
      const date = new Date(hashSettings.search)
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()

      state.search = [year, month, day]
      state.year = year
      state.month = month
    }

    window.location.hash = ''
  }

  return state
}

function reducer (state, action) {
  switch (action.type) {
    case 'change':
    {
      const shiftModelSelected = action.payload.shiftModel || state.shiftModel || shift66Name
      const shiftModel = shiftModelNames.includes(shiftModelSelected)
        ? shiftModelSelected
        : state.shiftModel

      const groupMin = Math.max(parseInt(action.payload.group, 10) || 0, 0)
      const group = Math.min(groupMin, shiftModelNumberOfGroups[shiftModel])

      if (group === state.group && shiftModel === state.shiftModel) {
        return state
      } else {
        return {
          ...state,
          group,
          shiftModel
        }
      }
    }

    case 'url_change':
      return {
        ...state,
        url: action.url
      }

    case 'goto':
      return {
        ...state,
        fullYear: action.fullYear != null
          ? action.fullYear
          : state.fullYear,
        year: action.year || state.year,
        month: action.month || state.month
      }

    case 'move':
    {
      let month = state.month + action.payload
      let year = state.year
      if (month < 0) {
        year -= 1
        month += 12
      } else if (month >= 12) {
        year += 1
        month -= 12
      }
      return {
        ...state,
        fullYear: false,
        year,
        month
      }
    }

    case 'toggle_full_year':
      return {
        ...state,
        fullYear: !state.fullYear
      }

    case 'group_change':
      return {
        ...state,
        group: action.payload
      }

    case 'model_change':
      if (shiftModelNames.every(model => model !== action.payload)) {
        throw new TypeError(`Unknown shift-model! "${action.payload}" is unknown!`)
      }
      return {
        ...state,
        shiftModel: action.payload,
        didSelectModel: true,
        group: state.group > shiftModelNumberOfGroups[action.payload]
          ? 0
          : state.group
      }

    case 'search':
      return {
        ...state,
        year: action.year,
        month: action.month,
        search: [action.year, action.month, action.day]
      }

    case 'clear_search':
      return {
        ...state,
        search: null
      }

    default:
      return state
  }
}
