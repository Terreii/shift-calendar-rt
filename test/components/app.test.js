import { h, render } from 'preact'
import { route } from 'preact-router'
import { expect } from 'chai'

import { sleep } from '../utils'

import App from '../../src/components/app'

describe('App', () => {
  let scratch

  beforeAll(() => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  afterAll(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  describe('routing', () => {
    it('should render the homepage', () => {
      render(<App />, scratch)

      expect(scratch.innerHTML).to.contain('Kalender')
    })

    it('should render /impressum/', async () => {
      render(<App />, scratch)
      route('/impressum')

      await sleep(1)

      expect(scratch.innerHTML).to.contain('Datenschutzerklärung')
    })
  })
})
