import { h, Component } from 'preact'
import style from './style.less'

export default class InstallButton extends Component {
  constructor (args) {
    super(args)

    this.state = {
      show: false
    }

    this.deferredPrompt = null

    window.addEventListener('beforeinstallprompt', event => {
      // for Chrome 67 and earlier
      event.preventDefault()

      // Stash the event so it can be triggered later.
      this.deferredPrompt = event

      this.setState({ show: true })
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.show !== this.state.show
  }

  async _onClick (event) {
    this.setState({ show: false })

    if (this.deferredPrompt == null) return

    // Show the prompt
    this.deferredPrompt.prompt()

    const choiceResult = await this.deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt')
    } else {
      console.log('User dismissed the A2HS prompt')
    }

    this.deferredPrompt = null
  }

  render () {
    if (!this.state.show) return null

    return <div class={style.Container}>
      <button class={style.Button} onClick={this._onClick.bind(this)}>
        + zum Home Screen hinzufügen
      </button>
    </div>
  }
}
