/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Mark_DoneInputs */

const en_deadlines_mark_done = /** @type {(inputs: Deadlines_Mark_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as done`)
};

const fr_deadlines_mark_done = /** @type {(inputs: Deadlines_Mark_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer comme faite`)
};

/**
* | output |
* | --- |
* | "Mark as done" |
*
* @param {Deadlines_Mark_DoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_mark_done = /** @type {((inputs?: Deadlines_Mark_DoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Mark_DoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_mark_done(inputs)
	return en_deadlines_mark_done(inputs)
});