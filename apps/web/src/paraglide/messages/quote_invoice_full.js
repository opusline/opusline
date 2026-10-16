/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Invoice_FullInputs */

const en_quote_invoice_full = /** @type {(inputs: Quote_Invoice_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice the whole quote`)
};

const fr_quote_invoice_full = /** @type {(inputs: Quote_Invoice_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturer la totalité`)
};

/**
* | output |
* | --- |
* | "Invoice the whole quote" |
*
* @param {Quote_Invoice_FullInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_invoice_full = /** @type {((inputs?: Quote_Invoice_FullInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Invoice_FullInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_invoice_full(inputs)
	return en_quote_invoice_full(inputs)
});