/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { h, Component } from 'preact'
import qs from 'querystringify'
import style from './style.less'

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
    return <div class={style.Main}>
      <input
        type='url'
        readonly
        value={this.getURL()}
        onFocus={event => {
          event.target.select()
        }}
      />

      <h6>Füge hinzu:</h6>

      <label class={style.checkbox}>
        <input
          type='checkbox'
          checked={this.state.shiftModel}
          onChange={this.doAddShiftModel}
        />
        Schichtmodell
      </label>

      <label class={style.checkbox}>
        <input
          type='checkbox'
          checked={this.state.group}
          disabled={this.props.group === 0}
          onChange={this.doAddGroup}
        />
        Gruppe
        {this.props.group === 0
          ? <small><br />Momentan sind alle Gruppen ausgewählt.</small>
          : null
        }
      </label>

      <label class={style.checkbox}>
        <input
          type='checkbox'
          checked={this.state.search}
          disabled={this.props.search == null}
          onChange={this.doAddSearch}
        />
        Der gesuchte Tag
        {this.props.search == null
          ? <small><br />Momentan gibt es kein Suchergebnis.</small>
          : null
        }
      </label>

      <div class={style.ButtonRow}>
        <button class={style.cancel} onClick={this.props.hide}>
          Abbrechen
        </button>
        <button class={style.share} onClick={this.onShare}>
          Teilen
        </button>
      </div>
    </div>
  }
}