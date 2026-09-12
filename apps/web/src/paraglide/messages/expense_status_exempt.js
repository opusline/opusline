/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_ExemptInputs */

const en_expense_status_exempt = /** @type {(inputs: Expense_Status_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No TVA`)
};

const fr_expense_status_exempt = /** @type {(inputs: Expense_Status_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hors TVA`)
};

/**
* | output |
* | --- |
* | "No TVA" |
*
* @param {Expense_Status_ExemptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_exempt = /** @type {((inputs?: Expense_Status_ExemptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_ExemptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_exempt(inputs)
	return en_expense_status_exempt(inputs)
});