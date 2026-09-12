/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Blocked_SubInputs */

const en_expense_status_blocked_sub = /** @type {(inputs: Expense_Status_Blocked_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`receipt missing`)
};

const fr_expense_status_blocked_sub = /** @type {(inputs: Expense_Status_Blocked_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`facture manquante`)
};

/**
* | output |
* | --- |
* | "receipt missing" |
*
* @param {Expense_Status_Blocked_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_blocked_sub = /** @type {((inputs?: Expense_Status_Blocked_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Blocked_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_blocked_sub(inputs)
	return en_expense_status_blocked_sub(inputs)
});