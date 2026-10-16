/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_External_Invoice_DetailInputs */

const en_invoicing_new_external_invoice_detail = /** @type {(inputs: Invoicing_New_External_Invoice_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount and PDF from another tool`)
};

const fr_invoicing_new_external_invoice_detail = /** @type {(inputs: Invoicing_New_External_Invoice_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant et PDF d'un autre outil`)
};

/**
* | output |
* | --- |
* | "Amount and PDF from another tool" |
*
* @param {Invoicing_New_External_Invoice_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_external_invoice_detail = /** @type {((inputs?: Invoicing_New_External_Invoice_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_External_Invoice_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_external_invoice_detail(inputs)
	return en_invoicing_new_external_invoice_detail(inputs)
});