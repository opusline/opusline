/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Receipt_MissingInputs */

const en_expense_status_receipt_missing = /** @type {(inputs: Expense_Status_Receipt_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt missing`)
};

const fr_expense_status_receipt_missing = /** @type {(inputs: Expense_Status_Receipt_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture manquante`)
};

/**
* | output |
* | --- |
* | "Receipt missing" |
*
* @param {Expense_Status_Receipt_MissingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_receipt_missing = /** @type {((inputs?: Expense_Status_Receipt_MissingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Receipt_MissingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_status_receipt_missing(inputs)
	return en_expense_status_receipt_missing(inputs)
});