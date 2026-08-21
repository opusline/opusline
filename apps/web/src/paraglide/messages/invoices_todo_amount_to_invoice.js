/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Invoices_Todo_Amount_To_InvoiceInputs */

const en_invoices_todo_amount_to_invoice = /** @type {(inputs: Invoices_Todo_Amount_To_InvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} to invoice`)
};

const fr_invoices_todo_amount_to_invoice = /** @type {(inputs: Invoices_Todo_Amount_To_InvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} à facturer`)
};

/**
* | output |
* | --- |
* | "{amount} to invoice" |
*
* @param {Invoices_Todo_Amount_To_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_amount_to_invoice = /** @type {((inputs: Invoices_Todo_Amount_To_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Amount_To_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_amount_to_invoice(inputs)
	return en_invoices_todo_amount_to_invoice(inputs)
});