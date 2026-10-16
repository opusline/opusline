/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Identity_VatInputs */

const en_invoicing_identity_vat = /** @type {(inputs: Invoicing_Identity_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`EU VAT number`)
};

const fr_invoicing_identity_vat = /** @type {(inputs: Invoicing_Identity_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA intracom.`)
};

/**
* | output |
* | --- |
* | "EU VAT number" |
*
* @param {Invoicing_Identity_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_identity_vat = /** @type {((inputs?: Invoicing_Identity_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Identity_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_identity_vat(inputs)
	return en_invoicing_identity_vat(inputs)
});