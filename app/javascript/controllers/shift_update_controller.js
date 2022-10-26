import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="shift-update"
export default class extends Controller {
  static values = {
    shifts: Object,
    zoneOffset: Number
  }

  #timeoutId = NaN

  connect() {
    this.update()
  }

  disconnect() {
    clearTimeout(this.#timeoutId)
  }

  update() {
    this.updateToday()
    this.updateShift()
    this.nextHourTimeout()
  }

  // Update the today row indicator
  updateToday() {
    const now = this.getEuropaZoneTime()
    const today = document.getElementById(`day_${now.toJSON().split("T")[0]}`)
    if (today.classList.contains("today")) return

    for (const oldToday of this.element.querySelectorAll(".today")) {
      oldToday.classList.remove("today")
    }
    today.classList.add("today")
  }

  // Update the current working shift indicator
  updateShift() {
    // TODO
  }

  getEuropaZoneTime() {
    return new Date(Date.now() + this.zoneOffsetValue * 1000)
  }

  nextHourTimeout() {
    const now = Date.now()
    const nextHour = new Date(now)
    nextHour.setHours(nextHour.getHours() + 1)
    nextHour.setMinutes(0)
    nextHour.setSeconds(0)
    const diff = nextHour.getTime() - now
    this.#timeoutId = setTimeout(this.update.bind(this), diff)
  }
}
