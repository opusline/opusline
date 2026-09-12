/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Reverse_ChargedInputs */

const en_expense_status_reverse_charged = /** @type {(inputs: Expense_Status_Reverse_ChargedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reverse charged`)
};

const fr_expense_status_reverse_charged = /** @type {(inputs: Expense_Status_Reverse_ChargedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autoliquidée`)
};

/**
* | output |
* | --- |
* | "Reverse charged" |
*
* @param {Expense_Status_Reverse_ChargedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_reverse_charged = /** @type {((inputs?: Expense_Status_Reverse_ChargedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Reverse_ChargedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_reverse_charged(inputs)
	return en_expense_status_reverse_charged(inputs)
});