/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_InvoiceInputs */

const en_invoicing_new_invoice = /** @type {(inputs: Invoicing_New_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice`)
};

const fr_invoicing_new_invoice = /** @type {(inputs: Invoicing_New_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture`)
};

/**
* | output |
* | --- |
* | "Invoice" |
*
* @param {Invoicing_New_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_invoice = /** @type {((inputs?: Invoicing_New_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_invoice(inputs)
	return en_invoicing_new_invoice(inputs)
});