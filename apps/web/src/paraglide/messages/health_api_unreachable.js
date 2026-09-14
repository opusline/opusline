/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Health_Api_UnreachableInputs */

const en_health_api_unreachable = /** @type {(inputs: Health_Api_UnreachableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API status: unreachable`)
};

const fr_health_api_unreachable = /** @type {(inputs: Health_Api_UnreachableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`État de l’API : injoignable`)
};

/**
* | output |
* | --- |
* | "API status: unreachable" |
*
* @param {Health_Api_UnreachableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const health_api_unreachable = /** @type {((inputs?: Health_Api_UnreachableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Health_Api_UnreachableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_health_api_unreachable(inputs)
	return en_health_api_unreachable(inputs)
});