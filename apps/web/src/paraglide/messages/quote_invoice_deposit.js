/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Quote_Invoice_DepositInputs */

const en_quote_invoice_deposit = /** @type {(inputs: Quote_Invoice_DepositInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice the deposit (${i?.rate} %)`)
};

const fr_quote_invoice_deposit = /** @type {(inputs: Quote_Invoice_DepositInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Facturer un acompte de ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "Invoice the deposit ({rate} %)" |
*
* @param {Quote_Invoice_DepositInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_invoice_deposit = /** @type {((inputs: Quote_Invoice_DepositInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Invoice_DepositInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_invoice_deposit(inputs)
	return en_quote_invoice_deposit(inputs)
});