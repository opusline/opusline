/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Expense_Status_Deductible_SubInputs */

const en_expense_status_deductible_sub = /** @type {(inputs: Expense_Status_Deductible_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA3 ${i?.month}`)
};

const fr_expense_status_deductible_sub = /** @type {(inputs: Expense_Status_Deductible_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "CA3 {month}" |
*
* @param {Expense_Status_Deductible_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_deductible_sub = /** @type {((inputs: Expense_Status_Deductible_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Deductible_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_deductible_sub(inputs)
	return en_expense_status_deductible_sub(inputs)
});