/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_RecurringInputs */

const en_expenses_field_recurring = /** @type {(inputs: Expenses_Field_RecurringInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recurring`)
};

const fr_expenses_field_recurring = /** @type {(inputs: Expenses_Field_RecurringInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Récurrent`)
};

/**
* | output |
* | --- |
* | "Recurring" |
*
* @param {Expenses_Field_RecurringInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_recurring = /** @type {((inputs?: Expenses_Field_RecurringInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_RecurringInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_recurring(inputs)
	return en_expenses_field_recurring(inputs)
});