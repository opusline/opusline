/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Note_LabelInputs */

const en_timer_note_label = /** @type {(inputs: Timer_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity`)
};

const fr_timer_note_label = /** @type {(inputs: Timer_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activité`)
};

/**
* | output |
* | --- |
* | "Activity" |
*
* @param {Timer_Note_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_note_label = /** @type {((inputs?: Timer_Note_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Note_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_note_label(inputs)
	return en_timer_note_label(inputs)
});