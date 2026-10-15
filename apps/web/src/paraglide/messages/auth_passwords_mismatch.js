/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Passwords_MismatchInputs */



/**
* | output |
* | --- |
* | "The passwords do not match." |
*
* @param {Auth_Passwords_MismatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_passwords_mismatch = /** @type {((inputs?: Auth_Passwords_MismatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passwords_MismatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les mots de passe ne correspondent pas.")
	return /** @type {LocalizedString} */ ("The passwords do not match.")
});