/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Rounding_MinutesInputs */

const en_rounding_minutes = /** @type {(inputs: Rounding_MinutesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`minutes`)
};

const fr_rounding_minutes = /** @type {(inputs: Rounding_MinutesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`minutes`)
};

/**
* | output |
* | --- |
* | "minutes" |
*
* @param {Rounding_MinutesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const rounding_minutes = /** @type {((inputs?: Rounding_MinutesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rounding_MinutesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_rounding_minutes(inputs)
	return en_rounding_minutes(inputs)
});