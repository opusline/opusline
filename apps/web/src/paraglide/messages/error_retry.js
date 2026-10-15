/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_RetryInputs */

const en_error_retry = /** @type {(inputs: Error_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try again`)
};

const fr_error_retry = /** @type {(inputs: Error_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réessayer`)
};

/**
* | output |
* | --- |
* | "Try again" |
*
* @param {Error_RetryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const error_retry = /** @type {((inputs?: Error_RetryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_RetryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_error_retry(inputs)
	return en_error_retry(inputs)
});