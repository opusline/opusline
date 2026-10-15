/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Filter_DeferredInputs */

const en_expense_filter_deferred = /** @type {(inputs: Expense_Filter_DeferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deferred`)
};

const fr_expense_filter_deferred = /** @type {(inputs: Expense_Filter_DeferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reportées`)
};

/**
* | output |
* | --- |
* | "Deferred" |
*
* @param {Expense_Filter_DeferredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_filter_deferred = /** @type {((inputs?: Expense_Filter_DeferredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Filter_DeferredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_filter_deferred(inputs)
	return en_expense_filter_deferred(inputs)
});