/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_DeductedInputs */

const en_expense_status_deducted = /** @type {(inputs: Expense_Status_DeductedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deducted`)
};

const fr_expense_status_deducted = /** @type {(inputs: Expense_Status_DeductedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déduite`)
};

/**
* | output |
* | --- |
* | "Deducted" |
*
* @param {Expense_Status_DeductedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_deducted = /** @type {((inputs?: Expense_Status_DeductedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_DeductedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_deducted(inputs)
	return en_expense_status_deducted(inputs)
});