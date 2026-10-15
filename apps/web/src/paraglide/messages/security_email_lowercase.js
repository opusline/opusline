/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_LowercaseInputs */

const en_security_email_lowercase = /** @type {(inputs: Security_Email_LowercaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Write the address in lowercase.`)
};

const fr_security_email_lowercase = /** @type {(inputs: Security_Email_LowercaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Écrivez l'adresse en minuscules.`)
};

/**
* | output |
* | --- |
* | "Write the address in lowercase." |
*
* @param {Security_Email_LowercaseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_lowercase = /** @type {((inputs?: Security_Email_LowercaseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_LowercaseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_lowercase(inputs)
	return en_security_email_lowercase(inputs)
});