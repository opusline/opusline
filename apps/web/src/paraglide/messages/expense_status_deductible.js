/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_DeductibleInputs */

const en_expense_status_deductible = /** @type {(inputs: Expense_Status_DeductibleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To deduct`)
};

const fr_expense_status_deductible = /** @type {(inputs: Expense_Status_DeductibleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À déduire`)
};

/**
* | output |
* | --- |
* | "To deduct" |
*
* @param {Expense_Status_DeductibleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_deductible = /** @type {((inputs?: Expense_Status_DeductibleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_DeductibleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_deductible(inputs)
	return en_expense_status_deductible(inputs)
});