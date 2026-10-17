/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Credit_Note_Invoice_DueInputs */

const en_credit_note_invoice_due = /** @type {(inputs: Credit_Note_Invoice_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Still due ${i?.amount}`)
};

const fr_credit_note_invoice_due = /** @type {(inputs: Credit_Note_Invoice_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reste à payer ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Still due {amount}" |
*
* @param {Credit_Note_Invoice_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_invoice_due = /** @type {((inputs: Credit_Note_Invoice_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Invoice_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_invoice_due(inputs)
	return en_credit_note_invoice_due(inputs)
});