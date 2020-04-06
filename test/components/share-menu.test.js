import { h } from 'preact'
import { render, fireEvent } from '@testing-library/preact'
import '@testing-library/jest-dom/extend-expect'

import ShareMenu from '../../src/components/share-menu'

describe('components/ShareMenu', () => {
  it('should render', () => {
    const { queryByLabelText, queryByText } = render(h(ShareMenu, {
      group: 0,
      search: null,
      shiftModel: '6-6',
      hide: () => {}
    }))

    const address = queryByLabelText('Adresse zum teilen:')
    expect(address).toBeTruthy()
    expect(address.nodeName).toBe('INPUT')
    expect(address).toHaveAttribute('type', 'url')
    expect(address).toHaveValue('http://localhost:8080/')

    const shiftModel = queryByLabelText('Schichtmodell')
    expect(shiftModel).toBeTruthy()
    expect(shiftModel.nodeName).toBe('INPUT')
    expect(shiftModel).toHaveAttribute('type', 'checkbox')

    expect(queryByLabelText('Gruppe')).toBeNull()
    const group = queryByText('Momentan sind alle Gruppen ausgewählt.')
    expect(group).toBeTruthy()
    expect(group.nodeName).toBe('SMALL')

    expect(queryByLabelText('Der gesuchte Tag')).toBeNull()
    const search = queryByText('Momentan gibt es kein Suchergebnis.')
    expect(search).toBeTruthy()
    expect(search.nodeName).toBe('SMALL')
  })

  it('should allow to share the group if a group is selected', () => {
    const { queryByLabelText, queryByText } = render(h(ShareMenu, {
      group: 5,
      search: null,
      shiftModel: '6-6',
      hide: () => {}
    }))

    const group = queryByLabelText('Gruppe')
    expect(group).toBeTruthy()
    expect(group.nodeName).toBe('INPUT')
    expect(group).toHaveAttribute('type', 'checkbox')
    expect(group).toBeEnabled()

    expect(queryByText('Momentan sind alle Gruppen ausgewählt.')).toBeNull()
  })

  it('should allow to share the search result if a there is one', () => {
    const { queryByLabelText, queryByText } = render(h(ShareMenu, {
      group: 0,
      search: [2020, 4, 5],
      shiftModel: '6-6',
      hide: () => {}
    }))

    const search = queryByLabelText('Der gesuchte Tag')
    expect(search).toBeTruthy()
    expect(search.nodeName).toBe('INPUT')
    expect(search).toHaveAttribute('type', 'checkbox')
    expect(search).toBeEnabled()

    expect(queryByText('Momentan gibt es kein Suchergebnis.')).toBeNull()
  })

  it('should update the url', async () => {
    const { queryByLabelText, queryByText, findByLabelText } = render(h(ShareMenu, {
      group: 5,
      search: [2020, 4, 5],
      shiftModel: '6-6',
      hide: () => {}
    }))

    const address = queryByLabelText('Adresse zum teilen:')
    expect(address).toHaveValue('http://localhost:8080/')

    const shareButton = queryByText('Teilen')
    expect(shareButton).toBeInTheDocument()
    expect(shareButton.nodeName).toBe('A')
    expect(shareButton).toBeEnabled()
    expect(shareButton.href)
      .toBe('mailto:?subject=Schichtkalender&' +
        'body=Meine%20Schichten%20beim%20Bosch%20Reutlingen:%20http://localhost:8080/')

    fireEvent.click(queryByLabelText('Schichtmodell'))
    expect(await findByLabelText('Schichtmodell')).toBeChecked()
    expect(address).toHaveValue('http://localhost:8080/#schichtmodell=6-6')
    expect(shareButton.href).toMatch(/mailto.*http:\/\/localhost:8080\/#schichtmodell=6-6/)

    fireEvent.click(queryByLabelText('Gruppe'))
    expect(await findByLabelText('Gruppe')).toBeChecked()
    expect(address).toHaveValue('http://localhost:8080/#group=5&schichtmodell=6-6')
    expect(shareButton.href)
      .toMatch(/mailto.*http:\/\/localhost:8080\/#group=5%26schichtmodell=6-6/)

    fireEvent.click(queryByLabelText('Der gesuchte Tag'))
    expect(await findByLabelText('Der gesuchte Tag')).toBeChecked()
    expect(address).toHaveValue('http://localhost:8080/#group=5&search=2020-5-5&schichtmodell=6-6')
    expect(shareButton.href)
      .toMatch(/mailto.*http:\/\/localhost:8080\/#group=5%26search=2020-5-5%26schichtmodell=6-6/)
  })

  it('should update the shift model and group together', async () => {
    const { queryByLabelText, findByLabelText } = render(h(ShareMenu, {
      group: 2,
      search: [2020, 4, 5],
      shiftModel: '6-6',
      hide: () => {}
    }))

    expect(queryByLabelText('Schichtmodell')).not.toBeChecked()
    expect(queryByLabelText('Gruppe')).not.toBeChecked()
    expect(queryByLabelText('Der gesuchte Tag')).not.toBeChecked()

    fireEvent.click(queryByLabelText('Gruppe'))
    expect(await findByLabelText('Gruppe')).toBeChecked()
    expect(queryByLabelText('Schichtmodell')).toBeChecked()
    expect(queryByLabelText('Der gesuchte Tag')).not.toBeChecked()

    fireEvent.click(queryByLabelText('Schichtmodell'))
    expect(await findByLabelText('Schichtmodell')).not.toBeChecked()
    expect(queryByLabelText('Gruppe')).not.toBeChecked()
    expect(queryByLabelText('Der gesuchte Tag')).not.toBeChecked()

    fireEvent.click(queryByLabelText('Schichtmodell'))
    expect(await findByLabelText('Schichtmodell')).toBeChecked()
    expect(queryByLabelText('Gruppe')).not.toBeChecked()
    expect(queryByLabelText('Der gesuchte Tag')).not.toBeChecked()

    fireEvent.click(queryByLabelText('Gruppe'))
    expect(await findByLabelText('Gruppe')).toBeChecked()

    fireEvent.click(queryByLabelText('Gruppe'))
    expect(await findByLabelText('Gruppe')).not.toBeChecked()
    expect(queryByLabelText('Schichtmodell')).toBeChecked()
    expect(queryByLabelText('Der gesuchte Tag')).not.toBeChecked()
  })

  it('should close if the cancel button is clicked', () => {
    const hideCallback = jest.fn()

    const { queryByText } = render(h(ShareMenu, {
      group: 0,
      search: null,
      shiftModel: '6-6',
      hide: hideCallback
    }))

    const cancelButton = queryByText('Abbrechen')
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton.nodeName).toBe('BUTTON')
    expect(cancelButton).toBeEnabled()

    fireEvent.click(cancelButton)
    expect(hideCallback).toHaveBeenCalled()
  })

  it('should use share if it exist', async () => {
    const hideCallback = jest.fn()

    const { queryByText, findByText } = render(h(ShareMenu, {
      group: 0,
      search: null,
      shiftModel: '6-6',
      hide: hideCallback
    }))

    const shareButton = queryByText('Teilen')

    expect(shareButton.href).toBe('mailto:?subject=Schichtkalender&' +
      'body=Meine%20Schichten%20beim%20Bosch%20Reutlingen:%20http://localhost:8080/')

    window.navigator.share = jest.fn(() => Promise.resolve())

    fireEvent.click(shareButton)
    await findByText('Teilen')

    expect(hideCallback).toHaveBeenCalled()
    expect(window.navigator.share).toHaveBeenCalledWith({
      url: new URL('http://localhost:8080/'),
      title: 'Schichtkalender',
      text: 'Meine Schichten beim Bosch Reutlingen: http://localhost:8080/'
    })
  })
})
