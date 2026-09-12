/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Per_MonthInputs */

const en_expenses_per_month = /** @type {(inputs: Expenses_Per_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`/ month`)
};

const fr_expenses_per_month = /** @type {(inputs: Expenses_Per_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`/ mois`)
};

/**
* | output |
* | --- |
* | "/ month" |
*
* @param {Expenses_Per_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_per_month = /** @type {((inputs?: Expenses_Per_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Per_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_per_month(inputs)
	return en_expenses_per_month(inputs)
});