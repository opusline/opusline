/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_UnchangedInputs */

const en_security_email_unchanged = /** @type {(inputs: Security_Email_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This is already the address you sign in with.`)
};

const fr_security_email_unchanged = /** @type {(inputs: Security_Email_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`C'est déjà l'adresse avec laquelle vous vous connectez.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_unchanged(inputs)
	return en_security_email_unchanged(inputs)
});