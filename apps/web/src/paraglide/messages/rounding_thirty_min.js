/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_Thirty_MinInputs */

const en_rounding_thirty_min = /** @type {(inputs: Rounding_Thirty_MinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`30 min`)
};

const fr_rounding_thirty_min = /** @type {(inputs: Rounding_Thirty_MinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`30 min`)
};

/**
* | output |
* | --- |
* | "30 min" |
*
* @param {Rounding_Thirty_MinInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_thirty_min = /** @type {((inputs?: Rounding_Thirty_MinInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_Thirty_MinInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_thirty_min(inputs)
	return en_rounding_thirty_min(inputs)
});