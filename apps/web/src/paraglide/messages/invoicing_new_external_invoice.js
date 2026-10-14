/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_External_InvoiceInputs */

const en_invoicing_new_external_invoice = /** @type {(inputs: Invoicing_New_External_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice issued elsewhere`)
};

const fr_invoicing_new_external_invoice = /** @type {(inputs: Invoicing_New_External_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture émise ailleurs`)
};

/**
* | output |
* | --- |
* | "Invoice issued elsewhere" |
*
* @param {Invoicing_New_External_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_external_invoice = /** @type {((inputs?: Invoicing_New_External_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_External_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_external_invoice(inputs)
	return en_invoicing_new_external_invoice(inputs)
});