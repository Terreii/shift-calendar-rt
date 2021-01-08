import { useReducer, useEffect } from 'preact/hooks'

import {
  shiftModelNames,
  shift66Name,
  shiftModelNumberOfGroups
} from '../lib/constants.js'

const initialState = {
  url: window.location.pathname,
  didSelectModel: false, // did the user select a shift-model once?
  shiftModel: shift66Name, // Which shift-model is it, the 6-4 model or the 6-6 model?
  search: null,
  group: 0 // group to display; 0 = all, 1 - 6 is group number
}

export default function useStateReducer () {
  const [state, dispatch] = useReducer(reducer, initialState, initState)

  useEffect(() => {
    window.localStorage.setItem('settings', JSON.stringify({
      didSelectModel: state.didSelectModel,
      group: state.group,
      shiftModel: state.shiftModel
    }))
  }, [state.didSelectModel, state.group, state.shiftModel])

  return [state, dispatch]
}

function initState (state) {
  try {
    const settings = JSON.parse(window.localStorage.getItem('settings'))
    return {
      ...state,
      didSelectModel: settings.didSelectModel,
      group: settings.group,
      shiftModel: settings.shiftModel
    }
  } catch (err) {
    return state
  }
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

      if (
        action.payload.search === state.search &&
        group === state.group &&
        shiftModel === state.shiftModel &&
        state.didSelectModel &&
        action.payload.url === state.url
      ) {
        return state
      } else {
        return {
          ...state,
          url: action.payload.url,
          search: action.payload.search,
          didSelectModel: true,
          group,
          shiftModel
        }
      }
    }

    default:
      return state
  }
}
