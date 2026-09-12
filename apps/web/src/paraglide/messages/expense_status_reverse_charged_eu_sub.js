/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Reverse_Charged_Eu_SubInputs */

const en_expense_status_reverse_charged_eu_sub = /** @type {(inputs: Expense_Status_Reverse_Charged_Eu_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`EU · due and deducted`)
};

const fr_expense_status_reverse_charged_eu_sub = /** @type {(inputs: Expense_Status_Reverse_Charged_Eu_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`UE · due et déduite`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_reverse_charged_eu_sub(inputs)
	return en_expense_status_reverse_charged_eu_sub(inputs)
});