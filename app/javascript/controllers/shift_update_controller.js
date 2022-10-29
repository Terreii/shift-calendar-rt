import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="shift-update"
export default class extends Controller {
  static values = {
    reload: Boolean,
    shifts: Object,
    zoneOffset: Number
  }

  #lastUpdateMonth = this.getEuropaZoneTime().getUTCMonth()
  #timeoutId = NaN

  connect() {
    this.update()
  }

  disconnect() {
    clearTimeout(this.#timeoutId)
  }

  visibilityChange() {
    if (document.visibilityState === 'visible') {
      this.update()
    } else {
      clearTimeout(this.#timeoutId)
    }
  }

  update() {
    const currentMonth = this.getEuropaZoneTime().getUTCMonth()
    if (this.reloadValue && this.#lastUpdateMonth !== currentMonth) {
      Turbo.visit(location.pathname, { action: "replace" })
    }
    this.#lastUpdateMonth = currentMonth

    this.updateToday()
    this.updateShift()
    this.nextTimeout()
  }

  // Update the today row indicator
  updateToday() {
    const now = this.getEuropaZoneTime()

    this.classOnlyToSelected("today", `#day_${now.toJSON().split("T")[0]}`)
  }

  // Update the current working shift indicator
  updateShift() {
    const now = this.getEuropaZoneTime()
    const hour = now.getUTCHours()

    // Select the current working shift
    const current = Object.entries(this.shiftsValue).find(([key, value]) => {
      if (value.start[0] > value.finish[0]) { // night -> goes to next day
        return value.start[0] <= hour || value.finish[0] > hour
      }
      return value.start[0] <= hour && value.finish[0] > hour
    })

    if (current) {
      const [key, times] = current
      if (times.start[0] > times.finish[0] && times.finish[0] > hour) {
        now.setDate(now.getDate() - 1) // move date 1 day back, because shift is from yesterday
      }
      this.classOnlyToSelected(
        "current_shift",
        `#day_${now.toJSON().split("T")[0]} > [data-shift=${key}]`
      )
    }
  }

  classOnlyToSelected(cssClass, selector) {
    const element = this.element.querySelector(selector)
    
    for (const other of this.element.querySelectorAll(`.${cssClass}`)) {
      if (other !== element) {
        other.classList.remove(cssClass)
      }
    }

    if (element) {
      element.classList.add(cssClass)
    }
  }

  getEuropaZoneTime() {
    return new Date(Date.now() + this.zoneOffsetValue * 1000)
  }

  nextTimeout() {
    const now = Date.now()
    const nextInterval = new Date(now)
    const minutes = Math.floor(nextInterval.getMinutes() / 5 + 1) * 5
    nextInterval.setMinutes(minutes)
    nextInterval.setSeconds(0)
    const diff = nextInterval.getTime() - now
    this.#timeoutId = setTimeout(this.update.bind(this), diff)
  }
}
