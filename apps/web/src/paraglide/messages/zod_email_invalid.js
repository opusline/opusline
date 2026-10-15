/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Zod_Email_InvalidInputs */

const en_zod_email_invalid = /** @type {(inputs: Zod_Email_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid email address.`)
};

const fr_zod_email_invalid = /** @type {(inputs: Zod_Email_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse e-mail invalide.`)
};

/**
* | output |
* | --- |
* | "Invalid email address." |
*
* @param {Zod_Email_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const zod_email_invalid = /** @type {((inputs?: Zod_Email_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Zod_Email_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_zod_email_invalid(inputs)
	return en_zod_email_invalid(inputs)
});