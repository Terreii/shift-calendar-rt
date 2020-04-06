/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { html, Component } from '../preact.js'
import qs from '../web_modules/querystringify.js'

export default class ShareMenu extends Component {
  state = {
    origin: window.location.origin,
    group: false,
    search: false,
    shiftModel: false,
    hash: ''
  }

  componentWillReceiveProps (nextProps) {
    setTimeout(() => { this.updateHash() }, 0)
  }

  doAddGroup = event => {
    if (this.props.group === 0 || this.props.group == null) return

    this.updateHash({ group: event.target.checked })
  }

  doAddSearch = event => {
    if (this.props.search == null) return

    this.updateHash({ search: event.target.checked })
  }

  doAddShiftModel = event => {
    if (this.props.shiftModel == null) return

    const shiftModel = event.target.checked

    this.updateHash({
      shiftModel,
      group: shiftModel ? this.state.group : false
    })
  }

  updateHash ({
    group = this.state.group,
    search = this.state.search,
    shiftModel = this.state.shiftModel
  } = {}) {
    const props = {}

    if (group && this.props.group !== 0) {
      props.group = this.props.group
      shiftModel = true
    }

    if (search && this.props.search != null) {
      const [year, month, date] = this.props.search
      props.search = `${year}-${month + 1}-${date}`
    }

    if (shiftModel && this.props.shiftModel != null) {
      props.schichtmodell = this.props.shiftModel
    }

    const hash = group || search || shiftModel
      ? qs.stringify(props, '#')
      : ''

    this.setState({
      group,
      search,
      shiftModel,
      hash
    })
  }

  onShare = event => {
    const url = this.getURL()

    if ('share' in window.navigator) {
      window.navigator.share({
        url,
        title: 'Schichtkalender',
        text: 'Meine Schichten beim Bosch Reutlingen: ' + url
      })
        .then(() => {
          this.props.hide()
        })
    } else {
      window.location.href =
        `mailto:?subject=Schichtkalender&body=Meine Schichten beim Bosch Reutlingen: ${url}`
    }
  }

  getURL () {
    return `${this.state.origin}/${this.state.hash}`
  }

  render () {
    return html`
      <div
        class=${'flex flex-col content-center items-stretch absolute top-0 left-0 ' +
          'mt-12 px-5 pt-3 pb-5 text-white bg-green-900 shadow-lg'}
      >
        <input
          class="bg-transparent text-white"
          type="url"
          readonly
          value=${this.getURL()}
          onFocus=${event => {
            event.target.select()
          }}
        />

        <h6 class="mt-5 text-lg p-0 m-0 mt-2 ml-4">Füge hinzu:</h6>

        <label class="mt-5 ml-2">
          <input
            class="h-4 w-4 mr-1"
            type="checkbox"
            checked=${this.state.shiftModel}
            onChange=${this.doAddShiftModel}
          />
          Schichtmodell
        </label>

        <label class="mt-5 ml-2">
          <input
            class="h-4 w-4 mr-1"
            type="checkbox"
            checked=${this.state.group}
            disabled=${this.props.group === 0}
            onChange=${this.doAddGroup}
          />
          Gruppe
          ${this.props.group === 0 &&  html`
            <small><br />Momentan sind alle Gruppen ausgewählt.</small>
          `}
        </label>

        <label class="mt-5 ml-2">
          <input
            class="h-4 w-4 mr-1"
            type="checkbox"
            checked=${this.state.search}
            disabled=${this.props.search == null}
            onChange=${this.doAddSearch}
          />
          Der gesuchte Tag
          ${this.props.search == null && html`
            <small><br />Momentan gibt es kein Suchergebnis.</small>
          `}
        </label>

        <div class="mt-5 flex flex-row flex-wrap content-center">
          <button
            class=${'flex-auto mt-5 mx-3 h-10 w-32 text-black text-center rounded bg-gray-100 ' +
              'shadow hover:bg-gray-400 active:bg-gray-400'}
            onClick=${this.props.hide}
          >
            Abbrechen
          </button>
          <button
            class=${'flex-auto mt-5 mx-3 h-10 w-32 text-white text-center rounded bg-purple-700 ' +
              'shadow hover:bg-purple-500 active:bg-purple-500'}
            onClick=${this.onShare}
          >
            Teilen
          </button>
        </div>
      </div>
    `
  }
}
