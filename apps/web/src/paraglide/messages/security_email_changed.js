/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_ChangedInputs */

const en_security_email_changed = /** @type {(inputs: Security_Email_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-in email changed. Your trusted browsers are forgotten.`)
};

const fr_security_email_changed = /** @type {(inputs: Security_Email_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse e-mail de connexion modifiée. Vos navigateurs de confiance sont oubliés.`)
};

/**
* | output |
* | --- |
* | "Sign-in email changed. Your trusted browsers are forgotten." |
*
* @param {Security_Email_ChangedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_changed = /** @type {((inputs?: Security_Email_ChangedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_ChangedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_changed(inputs)
	return en_security_email_changed(inputs)
});