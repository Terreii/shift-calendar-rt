/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { createTestStore } from '../../tests/utils'

import {
  addVacation,
  startEdit,
  endEdit,
  setName,
  setNote,
  addDay,
  removeDay,
  doSave,
  doLoad,
  selectId
} from './vacation'

describe('reducers/vacation', () => {
  it('should create new vacation', () => {
    const { dispatch, getDiff } = createTestStore()

    dispatch(addVacation())

    expect(getDiff()).toEqual({
      vacation: {
        _id: 'new',
        isEditing: true
      }
    })
  })

  it('should update the name', () => {
    const { dispatch, setMark, getDiff } = createTestStore()
    dispatch(addVacation())
    setMark('A')

    dispatch(setName('Skiing'))
    expect(getDiff('A')).toEqual({
      vacation: {
        name: 'Skiing'
      }
    })
  })

  it('should update the note', () => {
    const { dispatch, setMark, getDiff } = createTestStore()
    dispatch(addVacation())
    setMark('A')

    dispatch(setNote('In the mountains'))
    expect(getDiff('A')).toEqual({
      vacation: {
        note: 'In the mountains'
      }
    })
  })

  it('should add a day', () => {
    const { dispatch, setMark, getDiff } = createTestStore()
    dispatch(addVacation())
    setMark('A')

    dispatch(addDay(2021, 12, 28))
    expect(getDiff('A')).toEqual({
      vacation: {
        days: {
          0: {
            day: 28,
            month: 12,
            year: 2021
          }
        }
      }
    })
  })

  it('should remove a day', () => {
    const { dispatch, setMark, getDiff } = createTestStore()
    dispatch(addVacation())
    dispatch(addDay(2021, 12, 28))
    dispatch(addDay(2021, 12, 29))
    setMark('A')

    dispatch(removeDay(2021, 12, 28))
    expect(getDiff('A')).toEqual({
      vacation: {
        days: {
          0: {
            day: 29
          },
          1: undefined
        }
      }
    })
  })

  it('should ignore wrong dates', () => {
    const { dispatch, setMark, getDiff } = createTestStore()
    dispatch(addVacation())
    setMark('A')

    // wrong dates added
    dispatch(addDay(2021, 13, 28))
    dispatch(addDay(2021, 11, 32))
    dispatch(addDay(2021, 11, 0))
    dispatch(addDay(2021, 0, 0))
    // dates as string
    dispatch(addDay('2021', 1, 2))
    dispatch(addDay(2021, '1', 2))
    dispatch(addDay(2021, 1, '2'))

    expect(getDiff('A')).toEqual({})

    dispatch(addDay(2021, 1, 2))
    setMark('B')

    // remove not existing day
    dispatch(removeDay(2021, 1, 3))
    expect(getDiff('B')).toEqual({})
  })

  it('should reset the state on endEdit', () => {
    const { dispatch, setMark, getDiff } = createTestStore()
    dispatch(addVacation())
    dispatch(setName('Skiing'))
    dispatch(setNote('In the mountains'))
    dispatch(addDay(2021, 12, 28))

    setMark('A')

    dispatch(endEdit())
    expect(getDiff('A')).toEqual({
      vacation: {
        _id: null,
        isEditing: false,
        name: '',
        note: '',
        days: {
          0: undefined
        }
      }
    })
  })

  it('should save a new vacation', async () => {
    const { store, dispatch, setMark, getDiff, db } = createTestStore()
    dispatch(addVacation())
    dispatch(setName('Skiing'))
    dispatch(setNote('In the mountains'))
    dispatch(addDay(2021, 12, 28))
    setMark('A')

    await dispatch(doSave())
    expect(getDiff('A')).toEqual({
      vacation: {
        _id: expect.stringMatching(
          // UUID RegEx
          /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
        ),
        isEditing: false
      }
    })

    const id = selectId(store.getState())
    const doc = await db.get(id)
    expect(doc).toEqual({
      _id: expect.stringMatching(
        // UUID RegEx
        /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
      ),
      _rev: expect.any(String),
      type: 'vacation',
      name: 'Skiing',
      note: 'In the mountains',
      days: [
        {
          day: 28,
          month: 12,
          year: 2021
        }
      ]
    })
  })

  it('should load a vacation', async () => {
    const { dispatch, getDiff, db } = createTestStore()

    await db.put({
      _id: '294b8e1c-0586-4a36-b44e-83128d912f45',
      type: 'vacation',
      name: 'Train ride',
      note: 'A cross europe',
      days: [
        {
          day: 3,
          month: 8,
          year: 2022
        },
        {
          day: 4,
          month: 8,
          year: 2022
        }
      ]
    })

    await dispatch(doLoad('294b8e1c-0586-4a36-b44e-83128d912f45'))

    expect(getDiff()).toEqual({
      vacation: {
        _id: '294b8e1c-0586-4a36-b44e-83128d912f45',
        name: 'Train ride',
        note: 'A cross europe',
        days: {
          0: {
            day: 3,
            month: 8,
            year: 2022
          },
          1: {
            day: 4,
            month: 8,
            year: 2022
          }
        }
      }
    })
  })

  it('should start edit mode with a loaded vacation', async () => {
    const { dispatch, setMark, getDiff, db } = createTestStore()

    await db.put({
      _id: '294b8e1c-0586-4a36-b44e-83128d912f45',
      type: 'vacation',
      name: 'Train ride',
      note: 'A cross europe',
      days: [
        {
          day: 3,
          month: 8,
          year: 2022
        },
        {
          day: 4,
          month: 8,
          year: 2022
        }
      ]
    })
    await dispatch(doLoad('294b8e1c-0586-4a36-b44e-83128d912f45'))
    setMark('A')

    dispatch(startEdit())

    expect(getDiff('A')).toEqual({
      vacation: {
        isEditing: true
      }
    })
  })
})
