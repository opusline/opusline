/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Write_FailedInputs */



/**
* | output |
* | --- |
* | "The operation failed. Try again in a moment." |
*
* @param {Timer_Write_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_write_failed = /** @type {((inputs?: Timer_Write_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Write_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("L'opération a échoué. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The operation failed. Try again in a moment.")
});