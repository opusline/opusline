/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Expenses_Todo_Missing_ReceiptInputs */

const en_expenses_todo_missing_receipt = /** @type {(inputs: Expenses_Todo_Missing_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · receipt expected`)
};

const fr_expenses_todo_missing_receipt = /** @type {(inputs: Expenses_Todo_Missing_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · facture attendue`)
};

/**
* | output |
* | --- |
* | "{supplier} · receipt expected" |
*
* @param {Expenses_Todo_Missing_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_missing_receipt = /** @type {((inputs: Expenses_Todo_Missing_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_Missing_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_missing_receipt(inputs)
	return en_expenses_todo_missing_receipt(inputs)
});