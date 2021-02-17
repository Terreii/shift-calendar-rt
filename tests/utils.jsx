/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { diff } from 'deep-object-diff'
import { Provider } from 'react-redux'
import PouchDB from 'pouchdb'
import memoryAdapter from 'pouchdb-adapter-memory'

import configureStore from '../lib/store'
import { changed } from '../lib/reducers/db'

PouchDB.plugin(memoryAdapter)

let dbs = []
let counter = 0
/**
 * Creates a new DB with a unique name and the adapter set to memory.
 * @param {string} name Name of the database
 * @param {PouchDB.MemoryAdapter.MemoryAdapterConfiguration} options  Options for the database.
 */
export function createUniqueDb (name = 'local', options = {}) {
  const db = new PouchDB(name + (counter++), {
    ...options,
    adapter: 'memory'
  })
  dbs.push(db)
  return db
}

beforeEach(() => {
  dbs = []
})

afterEach(async () => {
  for (const db of dbs) {
    try {
      await db.destroy()
    } catch (err) {}
  }
})

/**
 * Sets up a db and the store, together with some diffing functions.
 */
export function createTestStore () {
  const store = configureStore()
  const db = createUniqueDb()
  store.dispatch((dispatch, getState, extraArg) => {
    extraArg.db = db
    dispatch(changed())
  })

  // Setup the state diffing
  const initialState = store.getState()
  const states = new Map()

  /**
   * Saves the current state under that key for later comparison
   * @param {string} key Key for the state.
   */
  const setMark = key => {
    states.set(key, store.getState())
  }

  /**
   * Get the diff from one state to another (default the current)
   * @param {string} startKey Base key
   * @param {string} endKey   Key of the to check state
   */
  const getDiff = (startKey, endKey) => {
    if (startKey && !states.has(startKey)) {
      throw new Error(`unknown start key '${startKey}'`)
    }
    if (endKey && !states.has(endKey)) {
      throw new Error(`unknown end key '${endKey}'`)
    }

    const oldState = startKey ? states.get(startKey) : initialState
    const newerState = endKey ? states.get(endKey) : store.getState()
    return diff(oldState, newerState)
  }

  return {
    store,
    db,
    dispatch: store.dispatch,
    setMark,
    getDiff
  }
}

export function Container ({ store, children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
