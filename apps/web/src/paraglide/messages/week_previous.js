/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_PreviousInputs */

const en_week_previous = /** @type {(inputs: Week_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous week`)
};

const fr_week_previous = /** @type {(inputs: Week_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semaine précédente`)
};

/**
* | output |
* | --- |
* | "Previous week" |
*
* @param {Week_PreviousInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_previous = /** @type {((inputs?: Week_PreviousInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_PreviousInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_previous(inputs)
	return en_week_previous(inputs)
});