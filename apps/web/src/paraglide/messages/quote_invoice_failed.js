/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Invoice_FailedInputs */

const en_quote_invoice_failed = /** @type {(inputs: Quote_Invoice_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice could not be created.`)
};

const fr_quote_invoice_failed = /** @type {(inputs: Quote_Invoice_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être créée.`)
};

/**
* | output |
* | --- |
* | "The invoice could not be created." |
*
* @param {Quote_Invoice_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_invoice_failed = /** @type {((inputs?: Quote_Invoice_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Invoice_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_invoice_failed(inputs)
	return en_quote_invoice_failed(inputs)
});