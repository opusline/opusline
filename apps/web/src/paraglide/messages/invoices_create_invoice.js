/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_InvoiceInputs */

const en_invoices_create_invoice = /** @type {(inputs: Invoices_Create_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create an invoice`)
};

const fr_invoices_create_invoice = /** @type {(inputs: Invoices_Create_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer une facture`)
};

/**
* | output |
* | --- |
* | "Create an invoice" |
*
* @param {Invoices_Create_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_invoice = /** @type {((inputs?: Invoices_Create_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_invoice(inputs)
	return en_invoices_create_invoice(inputs)
});