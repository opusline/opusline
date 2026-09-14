/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Expenses_Todo_Unmatched_Debit_SubInputs */

const en_expenses_todo_unmatched_debit_sub = /** @type {(inputs: Expenses_Todo_Unmatched_Debit_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Business account · ${i?.date} · no expense matches`)
};

const fr_expenses_todo_unmatched_debit_sub = /** @type {(inputs: Expenses_Todo_Unmatched_Debit_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Compte pro · ${i?.date} · aucune dépense ne correspond`)
};

/**
* | output |
* | --- |
* | "Business account · {date} · no expense matches" |
*
* @param {Expenses_Todo_Unmatched_Debit_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_unmatched_debit_sub = /** @type {((inputs: Expenses_Todo_Unmatched_Debit_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_Unmatched_Debit_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_unmatched_debit_sub(inputs)
	return en_expenses_todo_unmatched_debit_sub(inputs)
});