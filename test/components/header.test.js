import { h } from 'preact'
import { expect } from 'chai'

import Header from '../../src/components/header'

describe('components/Header', () => {
  it('should show the correct navigation links and buttons', () => {
    const header = <Header />
    expect(header).to.contain(<a
      href='/'
      tabIndex='0'
      class={
        'pl-4 text-white no-underline hover:underline focus:underline focus:shadow-outline'
      }
    >
      Kalender
    </a>)

    expect(header).to.contain(<button
      title='zeige aktuellen Monat'
      class={'px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 ' +
              'focus:shadow-outline focus:outline-none'}
    >
      Heute
    </button>)

    expect(header).to.contain(<button
      title='vorigen Monat'
      aria-label='vorigen Monat'
      class={'px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 ' +
        'focus:shadow-outline focus:outline-none'}
    >
      {'<'}
    </button>)

    expect(header).to.contain(<button
      title='nächster Monat'
      aria-label='nächster Monat'
      class={'px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 ' +
        'focus:shadow-outline focus:outline-none'}
    >
      {'>'}
    </button>)
  })
})
