import { h } from 'preact'
import { render } from '@testing-library/preact'

import App from '../../src/components/app'

jest.mock('../../src/components/download.js')

describe('App', () => {
  it('should render the homepage', () => {
    const { queryByText } = render(h(App))

    expect(queryByText('Kalender')).toBeTruthy()
  })
})
