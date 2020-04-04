import { h } from './web_modules/preact.js'
import htm from './web_modules/htm.js'

export * from './web_modules/preact.js'

export const html = htm.bind(h)
