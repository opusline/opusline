/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_BlockedInputs */

const en_expense_status_blocked = /** @type {(inputs: Expense_Status_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Blocked`)
};

const fr_expense_status_blocked = /** @type {(inputs: Expense_Status_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bloquée`)
};

/**
* | output |
* | --- |
* | "Blocked" |
*
* @param {Expense_Status_BlockedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_blocked = /** @type {((inputs?: Expense_Status_BlockedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_BlockedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_blocked(inputs)
	return en_expense_status_blocked(inputs)
});