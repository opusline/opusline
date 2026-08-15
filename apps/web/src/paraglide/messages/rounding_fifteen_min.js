/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_Fifteen_MinInputs */

const en_rounding_fifteen_min = /** @type {(inputs: Rounding_Fifteen_MinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`15 min`)
};

const fr_rounding_fifteen_min = /** @type {(inputs: Rounding_Fifteen_MinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`15 min`)
};

/**
* | output |
* | --- |
* | "15 min" |
*
* @param {Rounding_Fifteen_MinInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_fifteen_min = /** @type {((inputs?: Rounding_Fifteen_MinInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_Fifteen_MinInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_fifteen_min(inputs)
	return en_rounding_fifteen_min(inputs)
});