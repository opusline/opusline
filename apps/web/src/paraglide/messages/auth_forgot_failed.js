/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_FailedInputs */



/**
* | output |
* | --- |
* | "The link could not be requested. Try again in a moment." |
*
* @param {Auth_Forgot_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_failed = /** @type {((inputs?: Auth_Forgot_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La demande n'a pas pu être envoyée. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The link could not be requested. Try again in a moment.")
});