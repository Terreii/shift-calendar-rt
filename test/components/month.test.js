import { h } from 'preact'
import { render } from '@testing-library/preact'

import Month from '../../src/components/month.js'
import selectMonthData from '../../src/lib/select-month-data'

describe('components/Month', () => {
  it('should display the correct month data', () => {
    const { queryByText } = render(h(Month, {
      year: 2019,
      month: 0,
      data: selectMonthData(2019, 0, false),
      today: [2019, 0, 13],
      group: 0
    }))

    const caption = queryByText('Januar 2019 (Jetzt)')
    expect(caption).toBeTruthy()
    expect(caption.nodeName).toBe('CAPTION')
  })
})
