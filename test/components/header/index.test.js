import { h } from 'preact'
import { expect } from 'chai'

import Header from '../../../src/components/header'

describe('components/Header', () => {
  it('should show the correct navigation links and buttons', () => {
    const header = <Header />
    expect(header).to.contain(<a href='/' tabIndex='0'>Kalender</a>)
    expect(header).to.contain(<button title='zeige aktuellen Monat'>Heute</button>)
    expect(header).to.contain(<button title='vorigen Monat' aria-label='vorigen Monat'>
      {'<'}
    </button>)
    expect(header).to.contain(<button title='nächster Monat' aria-label='nächster Monat'>
      {'>'}
    </button>)
  })
})
