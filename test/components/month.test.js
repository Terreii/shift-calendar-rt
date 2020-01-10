import { h } from 'preact'
import { expect } from 'chai'

import Month from '../../src/components/month.js'
import selectMonthData from '../../src/lib/select-month-data'

describe('components/Month', () => {
  it('should display the correct month data', () => {
    const month = <Month
      year={2019}
      month={0}
      data={selectMonthData(2019, 0, false)}
      today={[2019, 0, 13]}
      group={0}
    />

    expect(month).to.contain(<caption
      class='border border-b-0 border-black bg-gray-400 text-black font-bold'
    >
      Januar 2019 (Jetzt)
    </caption>)
  })
})
