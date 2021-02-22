/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useEffect } from 'react'

export const vacations = {
  _id: '_design/vacations',
  views: {
    vacations: {
      map: function (doc) {
        if (doc.type === 'vacation') {
          doc.days.forEach(function (day) {
            emit([day.year, day.month, day.day], doc.name)
          })
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

/**
 * Hook to create and update ddocs/views.
 * @param {PouchDB.Database} db   Database where the ddocs/views should be created.
 */
export function useCreateViews (db) {
  useEffect(() => {
    createView(db, vacations)
      .catch(err => {
        console.error(err)
      })
  }, [db])
}

/**
 * Create and update a view.
 * @param {PouchDB.Database} db   Database where the ddoc/view should be created.
 * @param {object} ddoc           Ddoc/view object.
 */
export async function createView (db, ddoc) {
  try {
    const doc = await db.get(ddoc._id)

    let didChange = false
    // Stores all view names. Still present views will be removed from this Set.
    // Rest will be deleted.
    const oldViewNames = new Set(Object.keys(doc.views))

    // update views
    for (const [name, { map, reduce }] of Object.entries(ddoc.views)) {
      if (name in doc.views) {
        oldViewNames.delete(name)

        const oldView = doc.views[name]

        // did map change
        if (oldView.map !== map) {
          didChange = true
          oldView.map = map
        }

        // did reduce change. Also check if both are nullish, and don't change it if so.
        if (oldView.reduce !== reduce && !(oldView.reduce == null && reduce == null)) {
          didChange = true
          oldView.reduce = reduce
        }
      } else {
        didChange = true
        doc.views[name] = {
          map,
          reduce
        }
      }
    }

    // delete removed views
    for (const key of oldViewNames) {
      didChange = true
      delete doc.views[key]
    }

    if (didChange) {
      return db.put(doc)
    }
  } catch (err) {
    if (err.status === 404) {
      return db.put(ddoc)
    }
    console.error(err)
  }
}

// placeholder
function emit (key, value) { console.log(key, value) }
