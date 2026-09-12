/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_DeferredInputs */

const en_expense_status_deferred = /** @type {(inputs: Expense_Status_DeferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deferred`)
};

const fr_expense_status_deferred = /** @type {(inputs: Expense_Status_DeferredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reportée`)
};

/**
* | output |
* | --- |
* | "Deferred" |
*
* @param {Expense_Status_DeferredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_deferred = /** @type {((inputs?: Expense_Status_DeferredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_DeferredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_deferred(inputs)
	return en_expense_status_deferred(inputs)
});