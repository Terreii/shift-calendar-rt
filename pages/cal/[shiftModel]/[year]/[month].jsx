/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useRouter } from 'next/router'

export default function Month () {
  const router = useRouter()
  return <div className='pt-16 text-black'>
    Month {router.query.year}-{router.query.month} with shift model {router.query.shiftModel}.
  </div>
}
