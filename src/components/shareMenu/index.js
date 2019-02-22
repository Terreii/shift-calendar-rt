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

  updateHash ({ group = this.state.group, search = this.state.search } = {}) {
    const props = {}

    if (group && this.props.group !== 0) {
      props.group = this.props.group
    }

    if (search && this.props.search != null) {
      const [year, month, date] = this.props.search
      props.search = `${year}-${month + 1}-${date}`
    }

    const hash = group || search ? qs.stringify(props, '#') : ''
    this.setState({
      group,
      search,
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
          value={this.state.group}
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
          value={this.state.search}
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
        <button class={style.cancle} onClick={this.props.hide}>
          Abbrechen
        </button>
        <button class={style.share} onClick={this.onShare}>
          Teilen
        </button>
      </div>
    </div>
  }
}
