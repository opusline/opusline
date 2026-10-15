/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Recurring_Day_InvalidInputs */

const en_expenses_recurring_day_invalid = /** @type {(inputs: Expenses_Recurring_Day_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a day between 1 and 31.`)
};

const fr_expenses_recurring_day_invalid = /** @type {(inputs: Expenses_Recurring_Day_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un jour entre 1 et 31.`)
};

/**
* | output |
* | --- |
* | "Enter a day between 1 and 31." |
*
* @param {Expenses_Recurring_Day_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_recurring_day_invalid = /** @type {((inputs?: Expenses_Recurring_Day_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Recurring_Day_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_recurring_day_invalid(inputs)
	return en_expenses_recurring_day_invalid(inputs)
});