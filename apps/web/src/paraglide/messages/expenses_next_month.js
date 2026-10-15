/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Next_MonthInputs */

const en_expenses_next_month = /** @type {(inputs: Expenses_Next_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next month`)
};

const fr_expenses_next_month = /** @type {(inputs: Expenses_Next_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois suivant`)
};

/**
* | output |
* | --- |
* | "Next month" |
*
* @param {Expenses_Next_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_next_month = /** @type {((inputs?: Expenses_Next_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Next_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_next_month(inputs)
	return en_expenses_next_month(inputs)
});