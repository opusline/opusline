/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Expense_Status_Deducted_SubInputs */

const en_expense_status_deducted_sub = /** @type {(inputs: Expense_Status_Deducted_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA3 of ${i?.date}`)
};

const fr_expense_status_deducted_sub = /** @type {(inputs: Expense_Status_Deducted_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA3 du ${i?.date}`)
};

/**
* | output |
* | --- |
* | "CA3 of {date}" |
*
* @param {Expense_Status_Deducted_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_deducted_sub = /** @type {((inputs: Expense_Status_Deducted_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Deducted_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_deducted_sub(inputs)
	return en_expense_status_deducted_sub(inputs)
});