/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Invoice_BalanceInputs */

const en_quote_invoice_balance = /** @type {(inputs: Quote_Invoice_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice the balance`)
};

const fr_quote_invoice_balance = /** @type {(inputs: Quote_Invoice_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturer le solde`)
};

/**
* | output |
* | --- |
* | "Invoice the balance" |
*
* @param {Quote_Invoice_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_invoice_balance = /** @type {((inputs?: Quote_Invoice_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Invoice_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_invoice_balance(inputs)
	return en_quote_invoice_balance(inputs)
});