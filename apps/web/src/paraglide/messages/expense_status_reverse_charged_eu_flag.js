/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Reverse_Charged_Eu_FlagInputs */



/**
* | output |
* | --- |
* | "EU" |
*
* @param {Expense_Status_Reverse_Charged_Eu_FlagInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_reverse_charged_eu_flag = /** @type {((inputs?: Expense_Status_Reverse_Charged_Eu_FlagInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Reverse_Charged_Eu_FlagInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("UE")
	return /** @type {LocalizedString} */ ("EU")
});