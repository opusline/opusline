/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ status: NonNullable<unknown> }} Health_Api_StatusInputs */

const en_health_api_status = /** @type {(inputs: Health_Api_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`API status: ${i?.status}`)
};

const fr_health_api_status = /** @type {(inputs: Health_Api_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`État de l’API : ${i?.status}`)
};

/**
* | output |
* | --- |
* | "API status: {status}" |
*
* @param {Health_Api_StatusInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const health_api_status = /** @type {((inputs: Health_Api_StatusInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Health_Api_StatusInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_health_api_status(inputs)
	return en_health_api_status(inputs)
});