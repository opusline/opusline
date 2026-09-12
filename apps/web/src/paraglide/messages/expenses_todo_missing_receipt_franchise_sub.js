/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Expenses_Todo_Missing_Receipt_Franchise_SubInputs */

const en_expenses_todo_missing_receipt_franchise_sub = /** @type {(inputs: Expenses_Todo_Missing_Receipt_Franchise_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Debited on ${i?.date}, the receipt has not been linked.`)
};

const fr_expenses_todo_missing_receipt_franchise_sub = /** @type {(inputs: Expenses_Todo_Missing_Receipt_Franchise_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prélèvement du ${i?.date} passé, la facture n'a pas été liée.`)
};

/**
* | output |
* | --- |
* | "Debited on {date}, the receipt has not been linked." |
*
* @param {Expenses_Todo_Missing_Receipt_Franchise_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_missing_receipt_franchise_sub = /** @type {((inputs: Expenses_Todo_Missing_Receipt_Franchise_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_Missing_Receipt_Franchise_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_missing_receipt_franchise_sub(inputs)
	return en_expenses_todo_missing_receipt_franchise_sub(inputs)
});