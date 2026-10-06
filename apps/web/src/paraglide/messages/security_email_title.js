/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_TitleInputs */

const en_security_email_title = /** @type {(inputs: Security_Email_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-in email`)
};

const fr_security_email_title = /** @type {(inputs: Security_Email_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse e-mail de connexion`)
};

/**
* | output |
* | --- |
* | "Sign-in email" |
*
* @param {Security_Email_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_title = /** @type {((inputs?: Security_Email_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_title(inputs)
	return en_security_email_title(inputs)
});