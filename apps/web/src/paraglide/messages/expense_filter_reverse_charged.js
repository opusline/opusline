/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Filter_Reverse_ChargedInputs */



/**
* | output |
* | --- |
* | "Reverse charged" |
*
* @param {Expense_Filter_Reverse_ChargedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_filter_reverse_charged = /** @type {((inputs?: Expense_Filter_Reverse_ChargedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Filter_Reverse_ChargedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Autoliquidées")
	return /** @type {LocalizedString} */ ("Reverse charged")
});