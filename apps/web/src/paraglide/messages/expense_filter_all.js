/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Filter_AllInputs */

const en_expense_filter_all = /** @type {(inputs: Expense_Filter_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

const fr_expense_filter_all = /** @type {(inputs: Expense_Filter_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toutes`)
};

/**
* | output |
* | --- |
* | "All" |
*
* @param {Expense_Filter_AllInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_filter_all = /** @type {((inputs?: Expense_Filter_AllInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Filter_AllInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_filter_all(inputs)
	return en_expense_filter_all(inputs)
});