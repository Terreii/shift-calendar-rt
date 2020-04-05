import { h } from 'preact'
import { render } from '@testing-library/preact'

import Header from '../../src/components/header'

describe('components/Header', () => {
  it('should show the correct navigation links and buttons', () => {
    const { queryByText } = render(h(Header))

    const link = queryByText('Kalender')
    expect(link).toBeTruthy()
    expect(link.nodeName).toBe('A')

    const todayButton = queryByText('Heute')
    expect(todayButton).toBeTruthy()
    expect(todayButton.nodeName).toBe('BUTTON')
    expect(todayButton.title).toBe('zeige aktuellen Monat')

    const yesterday = queryByText('<')
    expect(yesterday).toBeTruthy()
    expect(yesterday.nodeName).toBe('BUTTON')
    expect(yesterday.title).toBe('vorigen Monat')
    expect(yesterday.getAttribute('aria-label')).toBe('vorigen Monat')

    const tomorrow = queryByText('>')
    expect(tomorrow).toBeTruthy()
    expect(tomorrow.nodeName).toBe('BUTTON')
    expect(tomorrow.title).toBe('nächster Monat')
    expect(tomorrow.getAttribute('aria-label')).toBe('nächster Monat')
  })
})
