/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ cue: NonNullable<unknown> }} Expense_Vat_On_ReceiptInputs */

const en_expense_vat_on_receipt = /** @type {(inputs: Expense_Vat_On_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`On the invoice: ${i?.cue}`)
};

const fr_expense_vat_on_receipt = /** @type {(inputs: Expense_Vat_On_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sur la facture : ${i?.cue}`)
};

/**
* | output |
* | --- |
* | "On the invoice: {cue}" |
*
* @param {Expense_Vat_On_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_on_receipt = /** @type {((inputs: Expense_Vat_On_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_On_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_on_receipt(inputs)
	return en_expense_vat_on_receipt(inputs)
});