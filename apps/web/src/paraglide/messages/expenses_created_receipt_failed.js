/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Created_Receipt_FailedInputs */

const en_expenses_created_receipt_failed = /** @type {(inputs: Expenses_Created_Receipt_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expense added, but the receipt could not be attached · link it from the journal.`)
};

const fr_expenses_created_receipt_failed = /** @type {(inputs: Expenses_Created_Receipt_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépense ajoutée, mais la facture n'a pas pu être jointe · liez-la depuis le journal.`)
};

/**
* | output |
* | --- |
* | "Expense added, but the receipt could not be attached · link it from the journal." |
*
* @param {Expenses_Created_Receipt_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_created_receipt_failed = /** @type {((inputs?: Expenses_Created_Receipt_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Created_Receipt_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_created_receipt_failed(inputs)
	return en_expenses_created_receipt_failed(inputs)
});