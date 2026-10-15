/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_NextInputs */

const en_week_next = /** @type {(inputs: Week_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next week`)
};

const fr_week_next = /** @type {(inputs: Week_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semaine suivante`)
};

/**
* | output |
* | --- |
* | "Next week" |
*
* @param {Week_NextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_next = /** @type {((inputs?: Week_NextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_NextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_next(inputs)
	return en_week_next(inputs)
});