/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function Confirm ({ children, confirmText, onClick }) {
  return (
    <aside
      className='fixed bottom-0 left-0 flex flex-col w-full bg-gray-300 border-t border-gray-600 shadow-lg sm:border-t-0 sm:rounded sm:mb-2 sm:ml-2 sm:max-w-sm'
    >
      <div className='p-4'>
        {children}
      </div>

      <div className='flex flex-row items-center justify-end m-3'>
        <button
          type='button'
          className='flex flex-row items-center justify-center w-32 px-2 py-1 mx-3 text-white bg-purple-700 shadow focus:ring focus:outline-none hover:bg-purple-600 focus:bg-purple-600 active:bg-purple-600 form-item'
          onClick={() => {
            onClick(true)
          }}
        >
          {confirmText}
        </button>
        <button
          type='button'
          onClick={() => {
            onClick(false)
          }}
          title='Klicke um den Kalender nicht zu installieren'
          className='flex flex-col items-center justify-center w-32 px-2 py-1 mx-3 border-black rounded-br-lg shadow hover:bg-gray-200 focus:bg-gray-200 focus:ring focus:outline-none form-item'
        >
          Abbrechen
        </button>
      </div>
    </aside>
  )
}
