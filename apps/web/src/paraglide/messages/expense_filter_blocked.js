/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Filter_BlockedInputs */

const en_expense_filter_blocked = /** @type {(inputs: Expense_Filter_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No receipt`)
};

const fr_expense_filter_blocked = /** @type {(inputs: Expense_Filter_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans justificatif`)
};

/**
* | output |
* | --- |
* | "No receipt" |
*
* @param {Expense_Filter_BlockedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_filter_blocked = /** @type {((inputs?: Expense_Filter_BlockedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Filter_BlockedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_filter_blocked(inputs)
	return en_expense_filter_blocked(inputs)
});