/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Bank_Match_Invoice_AriaInputs */

const en_bank_match_invoice_aria = /** @type {(inputs: Bank_Match_Invoice_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open invoice ${i?.number}`)
};

const fr_bank_match_invoice_aria = /** @type {(inputs: Bank_Match_Invoice_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ouvrir la facture ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Open invoice {number}" |
*
* @param {Bank_Match_Invoice_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_match_invoice_aria = /** @type {((inputs: Bank_Match_Invoice_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Match_Invoice_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_match_invoice_aria(inputs)
	return en_bank_match_invoice_aria(inputs)
});