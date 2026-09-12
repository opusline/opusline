/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Reverse_Charged_Non_Eu_FlagInputs */

const en_expense_status_reverse_charged_non_eu_flag = /** @type {(inputs: Expense_Status_Reverse_Charged_Non_Eu_FlagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`non-EU`)
};

const fr_expense_status_reverse_charged_non_eu_flag = /** @type {(inputs: Expense_Status_Reverse_Charged_Non_Eu_FlagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hors UE`)
};

/**
* | output |
* | --- |
* | "non-EU" |
*
* @param {Expense_Status_Reverse_Charged_Non_Eu_FlagInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_reverse_charged_non_eu_flag = /** @type {((inputs?: Expense_Status_Reverse_Charged_Non_Eu_FlagInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Reverse_Charged_Non_Eu_FlagInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_reverse_charged_non_eu_flag(inputs)
	return en_expense_status_reverse_charged_non_eu_flag(inputs)
});