/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Expenses_Todo_Unmatched_DebitInputs */

const en_expenses_todo_unmatched_debit = /** @type {(inputs: Expenses_Todo_Unmatched_DebitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Debit ${i?.label}`)
};

const fr_expenses_todo_unmatched_debit = /** @type {(inputs: Expenses_Todo_Unmatched_DebitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prélèvement ${i?.label}`)
};

/**
* | output |
* | --- |
* | "Debit {label}" |
*
* @param {Expenses_Todo_Unmatched_DebitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_unmatched_debit = /** @type {((inputs: Expenses_Todo_Unmatched_DebitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_Unmatched_DebitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_unmatched_debit(inputs)
	return en_expenses_todo_unmatched_debit(inputs)
});