/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_SubmitInputs */

const en_security_email_submit = /** @type {(inputs: Security_Email_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change email`)
};

const fr_security_email_submit = /** @type {(inputs: Security_Email_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer l'adresse e-mail`)
};

/**
* | output |
* | --- |
* | "Change email" |
*
* @param {Security_Email_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_submit = /** @type {((inputs?: Security_Email_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_submit(inputs)
	return en_security_email_submit(inputs)
});