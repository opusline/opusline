/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_Recurring_DayInputs */

const en_expenses_field_recurring_day = /** @type {(inputs: Expenses_Field_Recurring_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Debit day`)
};

const fr_expenses_field_recurring_day = /** @type {(inputs: Expenses_Field_Recurring_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jour du prélèvement`)
};

/**
* | output |
* | --- |
* | "Debit day" |
*
* @param {Expenses_Field_Recurring_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_recurring_day = /** @type {((inputs?: Expenses_Field_Recurring_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_Recurring_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_recurring_day(inputs)
	return en_expenses_field_recurring_day(inputs)
});