import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Month from './month'
import selectMonthData from '../lib/select-month-data'
import { Container, createTestStore } from '../tests/utils'

describe('components/month', () => {
  it('should display the correct month data', () => {
    const { store } = createTestStore()
    const { queryByText } = render(
      <Container store={store}>
        <Month
          year={2019}
          month={0}
          data={selectMonthData(2019, 0, false)}
          today={[2019, 0, 13]}
          group={0}
        />
      </Container>
    )

    const caption = queryByText('Januar 2019 (Jetzt)')
    expect(caption).toBeTruthy()
    expect(caption.nodeName).toBe('CAPTION')
  })

  it('should pass aXe', async () => {
    const { store } = createTestStore()
    const { container } = render(
      <Container store={store}>
        <Month
          year={2019}
          month={0}
          data={selectMonthData(2019, 0, false)}
          today={[2019, 0, 13]}
          group={0}
        />
      </Container>
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
