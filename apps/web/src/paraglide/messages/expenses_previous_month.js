/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Previous_MonthInputs */

const en_expenses_previous_month = /** @type {(inputs: Expenses_Previous_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous month`)
};

const fr_expenses_previous_month = /** @type {(inputs: Expenses_Previous_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois précédent`)
};

/**
* | output |
* | --- |
* | "Previous month" |
*
* @param {Expenses_Previous_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_previous_month = /** @type {((inputs?: Expenses_Previous_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Previous_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_previous_month(inputs)
	return en_expenses_previous_month(inputs)
});