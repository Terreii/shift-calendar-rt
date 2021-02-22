/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './reducers/index'

export default function createStore () {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      thunk: {
        extraArgument: { db: null }
      }
    })
  })
  return store
}
