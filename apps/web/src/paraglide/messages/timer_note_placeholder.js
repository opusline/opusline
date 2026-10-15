/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Note_PlaceholderInputs */

const en_timer_note_placeholder = /** @type {(inputs: Timer_Note_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current activity…`)
};

const fr_timer_note_placeholder = /** @type {(inputs: Timer_Note_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activité en cours…`)
};

/**
* | output |
* | --- |
* | "Current activity…" |
*
* @param {Timer_Note_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_note_placeholder = /** @type {((inputs?: Timer_Note_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Note_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_note_placeholder(inputs)
	return en_timer_note_placeholder(inputs)
});