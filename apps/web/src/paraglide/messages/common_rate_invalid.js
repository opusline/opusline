/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Rate_InvalidInputs */

const en_common_rate_invalid = /** @type {(inputs: Common_Rate_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a rate between 0 and 100.`)
};

const fr_common_rate_invalid = /** @type {(inputs: Common_Rate_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un taux entre 0 et 100.`)
};

/**
* | output |
* | --- |
* | "Enter a rate between 0 and 100." |
*
* @param {Common_Rate_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_rate_invalid = /** @type {((inputs?: Common_Rate_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Rate_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_rate_invalid(inputs)
	return en_common_rate_invalid(inputs)
});