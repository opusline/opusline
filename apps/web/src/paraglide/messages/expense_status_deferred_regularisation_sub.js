/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Expense_Status_Deferred_Regularisation_SubInputs */

const en_expense_status_deferred_regularisation_sub = /** @type {(inputs: Expense_Status_Deferred_Regularisation_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`box 21 · CA3 ${i?.month}`)
};

const fr_expense_status_deferred_regularisation_sub = /** @type {(inputs: Expense_Status_Deferred_Regularisation_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`case 21 · CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "box 21 · CA3 {month}" |
*
* @param {Expense_Status_Deferred_Regularisation_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_deferred_regularisation_sub = /** @type {((inputs: Expense_Status_Deferred_Regularisation_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Deferred_Regularisation_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_deferred_regularisation_sub(inputs)
	return en_expense_status_deferred_regularisation_sub(inputs)
});