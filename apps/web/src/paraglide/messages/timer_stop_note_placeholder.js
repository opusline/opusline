/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Stop_Note_PlaceholderInputs */

const en_timer_stop_note_placeholder = /** @type {(inputs: Timer_Stop_Note_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PR review, scoping…`)
};

const fr_timer_stop_note_placeholder = /** @type {(inputs: Timer_Stop_Note_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revue PR, cadrage…`)
};

/**
* | output |
* | --- |
* | "PR review, scoping…" |
*
* @param {Timer_Stop_Note_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_stop_note_placeholder = /** @type {((inputs?: Timer_Stop_Note_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Stop_Note_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_stop_note_placeholder(inputs)
	return en_timer_stop_note_placeholder(inputs)
});