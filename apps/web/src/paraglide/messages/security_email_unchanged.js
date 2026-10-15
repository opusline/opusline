/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_UnchangedInputs */



/**
* | output |
* | --- |
* | "This is already the address you sign in with." |
*
* @param {Security_Email_UnchangedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_unchanged = /** @type {((inputs?: Security_Email_UnchangedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_UnchangedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("C'est déjà l'adresse avec laquelle vous vous connectez.")
	return /** @type {LocalizedString} */ ("This is already the address you sign in with.")
});