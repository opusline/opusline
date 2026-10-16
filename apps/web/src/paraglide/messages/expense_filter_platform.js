/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Filter_PlatformInputs */

const en_expense_filter_platform = /** @type {(inputs: Expense_Filter_PlatformInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From the platform`)
};

const fr_expense_filter_platform = /** @type {(inputs: Expense_Filter_PlatformInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Via la plateforme`)
};

/**
* | output |
* | --- |
* | "From the platform" |
*
* @param {Expense_Filter_PlatformInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_filter_platform = /** @type {((inputs?: Expense_Filter_PlatformInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Filter_PlatformInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_filter_platform(inputs)
	return en_expense_filter_platform(inputs)
});