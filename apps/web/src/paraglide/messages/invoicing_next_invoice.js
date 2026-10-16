/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Next_InvoiceInputs */

const en_invoicing_next_invoice = /** @type {(inputs: Invoicing_Next_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next invoice`)
};

const fr_invoicing_next_invoice = /** @type {(inputs: Invoicing_Next_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prochaine facture`)
};

/**
* | output |
* | --- |
* | "Next invoice" |
*
* @param {Invoicing_Next_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_next_invoice = /** @type {((inputs?: Invoicing_Next_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Next_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_next_invoice(inputs)
	return en_invoicing_next_invoice(inputs)
});