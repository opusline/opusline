/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown>, client: NonNullable<unknown> }} Credit_Note_Invoice_RefInputs */

const en_credit_note_invoice_ref = /** @type {(inputs: Credit_Note_Invoice_RefInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number} · ${i?.client}`)
};

const fr_credit_note_invoice_ref = /** @type {(inputs: Credit_Note_Invoice_RefInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Facture ${i?.number} · ${i?.client}`)
};

/**
* | output |
* | --- |
* | "Invoice {number} · {client}" |
*
* @param {Credit_Note_Invoice_RefInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_invoice_ref = /** @type {((inputs: Credit_Note_Invoice_RefInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Invoice_RefInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_invoice_ref(inputs)
	return en_credit_note_invoice_ref(inputs)
});