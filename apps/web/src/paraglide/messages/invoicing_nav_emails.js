/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Nav_EmailsInputs */

const en_invoicing_nav_emails = /** @type {(inputs: Invoicing_Nav_EmailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-mails`)
};

const fr_invoicing_nav_emails = /** @type {(inputs: Invoicing_Nav_EmailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-mails`)
};

/**
* | output |
* | --- |
* | "E-mails" |
*
* @param {Invoicing_Nav_EmailsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_nav_emails = /** @type {((inputs?: Invoicing_Nav_EmailsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Nav_EmailsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_nav_emails(inputs)
	return en_invoicing_nav_emails(inputs)
});