/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Confirm_Password_FailedInputs */



/**
* | output |
* | --- |
* | "The password could not be checked. Try again in a moment." |
*
* @param {Security_Confirm_Password_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_confirm_password_failed = /** @type {((inputs?: Security_Confirm_Password_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Confirm_Password_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le mot de passe n'a pas pu être vérifié. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The password could not be checked. Try again in a moment.")
});