/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Reverse_Charged_Eu_SubInputs */



/**
* | output |
* | --- |
* | "EU · due and deducted" |
*
* @param {Expense_Status_Reverse_Charged_Eu_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_reverse_charged_eu_sub = /** @type {((inputs?: Expense_Status_Reverse_Charged_Eu_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Reverse_Charged_Eu_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("UE · due et déduite")
	return /** @type {LocalizedString} */ ("EU · due and deducted")
});