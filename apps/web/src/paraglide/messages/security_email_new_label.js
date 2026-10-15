/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Email_New_LabelInputs */

const en_security_email_new_label = /** @type {(inputs: Security_Email_New_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New email address`)
};

const fr_security_email_new_label = /** @type {(inputs: Security_Email_New_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouvelle adresse e-mail`)
};

/**
* | output |
* | --- |
* | "New email address" |
*
* @param {Security_Email_New_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_email_new_label = /** @type {((inputs?: Security_Email_New_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Email_New_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_email_new_label(inputs)
	return en_security_email_new_label(inputs)
});