import { render } from '@testing-library/react'

import { Container, createTestStore } from '../tests/utils'

import Header from './header'

jest.mock('../hooks/settings')
jest.mock('../hooks/time')

describe('components/Header', () => {
  it('should show the correct navigation links and buttons', () => {
    const { store, db } = createTestStore()
    const { queryByText } = render(
      <Container store={store} db={db}>
        <Header />
      </Container>
    )

    const link = queryByText('Kalender')
    expect(link).toBeTruthy()
    expect(link.nodeName).toBe('SPAN')

    const todayButton = queryByText('Heute')
    expect(todayButton).toBeTruthy()
    expect(todayButton.nodeName).toBe('A')
    expect(todayButton.href).toBe('http://localhost/cal/6-6#2021-01-25')
    expect(todayButton.title).toBe('zeige aktuellen Monat')

    const yesterday = queryByText('<')
    expect(yesterday).toBeTruthy()
    expect(yesterday.nodeName).toBe('A')
    expect(yesterday.href).toBe('http://localhost/cal/6-6/2020/12')
    expect(yesterday.title).toBe('vorigen Monat')

    const tomorrow = queryByText('>')
    expect(tomorrow).toBeTruthy()
    expect(tomorrow.nodeName).toBe('A')
    expect(tomorrow.href).toBe('http://localhost/cal/6-6/2021/02')
    expect(tomorrow.title).toBe('nächster Monat')
  })
})
